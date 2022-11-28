/**
 * Handles authentication of API requests through various providers (currently Google and API keys)
 * @module authHandler
 */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import './dbHandler';
import Scouter from './Scouter';
import StatusCodes from './StatusCodes';

const { OAuth2Client } = require('google-auth-library');
const dbHandler = require('./dbHandler');

const CLIENT_ID = '291863698243-obu2fpbfpr7ul9db9lm7rmc1e4r3oeag.apps.googleusercontent.com';
const client: any = new OAuth2Client(CLIENT_ID);


/**
 * @memberOf module:authHandler
 * @desc Represents the final authentication result returned from this module.
 */

interface AuthResult {
  /** Boolean describing the overall authentication result. */
  success: boolean;
  
  /** Status code returned by the external authentication provider, if applicable. */
  status?: number;

  /** Reason for authentication failure, if any. */
  reason?: string;

  /** 
   * If authentication is successful, return authenticated user representation. 
   * @see Scouter
  */
  user?: Scouter;
}

/**
 * Verifies the bearer token with Google OAuth to ensure that the request comes from a legitimate, signed-in user (JWT authentication).
 * @memberOf module:authHandler
 * @param bearerHeader Value of the Authorization header in the HTTP request. May or may not contain the string "Bearer" in front of the token.
 * @param db instance of DB client.
 * @param force_team if true, requires the user to be part of the team. set to false when enrolling new users as they will not be part of a team
 * @returns AuthResult instance describing the final authentication result.
 */

const checkBearerToken = async (bearerHeader: Array<string>, db: any, force_team = true): Promise<AuthResult> => {
  let token; let type;
  // Bearer token may or may not have "Bearer" in front: account for both cases.
  if (bearerHeader.length === 2) {
    [type, token] = bearerHeader
  } else if (bearerHeader.length === 1) {
    [token] = bearerHeader
  } else {
    const return_val: AuthResult = { success: false, status: StatusCodes.not_authorized, reason: `Unknown authentication scheme "${type}" (expected Bearer).` }
    return return_val;
  }
  try {
    const ticket = await client.verifyIdToken({ // call Google verification and all the applications that are authorized to generate tokens that interact with the API.
      idToken: token,
      audience: [CLIENT_ID, '291863698243-4bp5d86k6mo5dk5ief9ve9rq6d7l1fob.apps.googleusercontent.com', '291863698243-eg5i4fh001n7sl28b0bqgp4h2vae9gn2.apps.googleusercontent.com', '291863698243-ofnqubd0fh5dqfhjo368c39uto1fmudt.apps.googleusercontent.com', '291863698243-obu2fpbfpr7ul9db9lm7rmc1e4r3oeag.apps.googleusercontent.com', '291863698243-ovppseib28p6usahf60igsp7ia3ovq6l.apps.googleusercontent.com', '291863698243-0dsmvs8uetpd9odms7aqn63iknroi4op.apps.googleusercontent.com', '291863698243-tlnq2ahg1kbav1alv0n5flhdqhjgkcpp.apps.googleusercontent.com'],
    });
    const payload = ticket.getPayload(); // get user data from response
    const user: Scouter = {
      id: payload.sub.toString(),
      name: payload.name.toString(),
      email: payload.email.toString(),
      team: await dbHandler.getUserTeam(db, payload.sub.toString()), // grab user <-> team assocation from database.
      provider: 'google', // since future API versions may support sign in with Apple, etc., add a provider field to distinguish users from different providers.
    }

    if (!user.team && force_team) {
      const return_val: AuthResult = { success: false, status: StatusCodes.not_authorized, reason: 'User is not registered to a team.' }
      return return_val;
    }

    const return_val: AuthResult = { success: true, user }
    return return_val;
  } catch (e) { // usually only triggered when the token is invalid (expired, etc.)
    console.error(`Could not get payload from ticket for reason: ${e}`);
    const return_val: AuthResult = { success: false, status: StatusCodes.not_authorized, reason: 'User could not be authenticated.' }
    return return_val;
  }
}

/**
 * Verifies that a CLIENT_ID and CLIENT_SECRET pair are correct and valid. Usually used instead of JWT authentication. 
 * @memberOf module:authHandler
 * @param id CLIENT_ID from the user
 * @param secret CLIENT_SECRET from the user. 
 * @param db instance of the DB client.
 * @param force_team if true, requires the user to be part of the team. set to false when enrolling new users as they will not be part of a team
 * @returns AuthResult instance describing the final authentication result.
 */

const checkAPIKey = async (id: string, secret: string, db: any, force_team = true): Promise<AuthResult> => {
  const isAuthorized = await dbHandler.checkKey(db, id, secret);
  if (isAuthorized) {
    const team = await dbHandler.getUserTeam(db, id);
    if (!team && force_team) {
      const return_val: AuthResult = { success: false, status: StatusCodes.not_authorized, reason: 'User is not registered to a team.' }
      return return_val;
    }
    const user: Scouter = {
      id,
      name: 'API User',
      email: 'apiuser@titanscouting',
      team,
      provider: 'api_key',
    }
    const return_val: AuthResult = { success: true, user };
    return return_val;
  }
  const return_val: AuthResult = { success: false, status: StatusCodes.not_authorized, reason: 'User could not be authenticated.' }
  return return_val;
}

/**
 * Wrapper function to bring the individual checking modules together. Selects the correct authentication method and runs the correct verification module.
 * @memberOf module:authHandler
 * @param req Express request
 * @param res Express response
 * @param next Express middleware next function
 * @param force_team if true, requires the user to be part of the team. set to false when enrolling new users as they will not be part of a team. Passes this value onto the correct module.
 * @returns Express next()
 */

const checkAuthWrapped = async (req: any, res: any, next: any, force_team = true): Promise<void> => {
  if (req.query.CLIENT_ID && req.query.CLIENT_SECRET) {
    // check API Key auth
    const { CLIENT_ID, CLIENT_SECRET } = req.query;
    const keyAuthResult: AuthResult = await checkAPIKey(CLIENT_ID, CLIENT_SECRET, req.db, force_team);
    if (!keyAuthResult.success) {
      return res.status(keyAuthResult.status).json({
        success: false,
        reason: keyAuthResult.reason,
      })
    }
    res.locals = Object.assign(res.locals, keyAuthResult.user);

    return next();
  }
  // else, must be Bearer token auth
  if (!req.header('Authorization')) {
    return res.status(StatusCodes.not_authorized).json({
      success: false,
      reason: 'Authentication credentials were not provided.',
    });
  }
  const bearerHeader = req.header('Authorization').split(' '); // Get token from correct header
  const googleAuthResult: AuthResult = await checkBearerToken(bearerHeader, req.db, force_team);
  if (!googleAuthResult.success) {
    return res.status(googleAuthResult.status).json({
      success: false,
      reason: googleAuthResult.reason,
    })
  }
  /**
   * Set res.locals.{id, name, email, team, provider} so that the API endpoint can access user identifying data after authentication flow is complete.
   */
  res.locals = Object.assign(res.locals, googleAuthResult.user); 

  return next();
};

/**
 * Provides a wrapper for the checkAuthWrapped function to make it easy to call verification as middleware.
 * This method is directly called by API routes.
 * Enforces team registration.
 * @memberOf module:authHandler
 * @param req Express request
 * @param res Express response
 * @param next Express middleware next function
 * @returns null
 */

export const checkAuth = async (req: any, res: any, next: any): Promise<void> => {
  checkAuthWrapped(req, res, next, true)
}

/**
 * Prevents authentication via API key on certain routes.
 * This method is directly called by API routes.
 * @memberOf module:authHandler
 * @param req Express request
 * @param res Express response
 * @param next Express middleware next function
 * @returns null
 */

export const noAPIKey = async (req, res, next) => {
  if (req.query.CLIENT_ID || req.query.CLIENT_SECRET) {
    res.status(StatusCodes.no_key_auth);
    res.json({ success: false, reason: 'This route does not allow authentication via API key' });
  }
  next();
};

/**
 * Provides a wrapper for the checkAuthWrapped function to make it easy to call verification as middleware.
 * This method is directly called by API routes.
 * Does not enforce team registration (used for routes such as /api/addUserToTeam)
 * @memberOf module:authHandler
 * @param req Express request
 * @param res Express response
 * @param next Express middleware next function
 * @returns null
 */

export const checkAuthNoTeam = async (req: any, res: any, next: any): Promise<void> => {
  checkAuthWrapped(req, res, next, false);
};