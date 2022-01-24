/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import './dbHandler';
import Scouter from './Scouter';
import StatusCodes from './StatusCodes';

const { OAuth2Client } = require('google-auth-library');
const dbHandler = require('./dbHandler');

const CLIENT_ID = '291863698243-obu2fpbfpr7ul9db9lm7rmc1e4r3oeag.apps.googleusercontent.com';
const client: any = new OAuth2Client(CLIENT_ID);

interface AuthResult {
  success: boolean;
  status?: number;
  reason?: string;
  user?: any;
}

const checkBearerToken = async (bearerHeader: Array<string>, db: any, force_team = true): Promise<AuthResult> => {
  let token; let
    type;
  if (bearerHeader.length === 2) {
    [type, token] = bearerHeader
  } else if (bearerHeader.length === 1) {
    [token] = bearerHeader
  } else {
    const return_val: AuthResult = { success: false, status: StatusCodes.not_authorized, reason: `Unknown authentication scheme "${type}" (expected Bearer).` }
    return return_val;
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [CLIENT_ID, '291863698243-4bp5d86k6mo5dk5ief9ve9rq6d7l1fob.apps.googleusercontent.com', '291863698243-eg5i4fh001n7sl28b0bqgp4h2vae9gn2.apps.googleusercontent.com', '291863698243-ofnqubd0fh5dqfhjo368c39uto1fmudt.apps.googleusercontent.com', '291863698243-obu2fpbfpr7ul9db9lm7rmc1e4r3oeag.apps.googleusercontent.com', '291863698243-ovppseib28p6usahf60igsp7ia3ovq6l.apps.googleusercontent.com', '291863698243-0dsmvs8uetpd9odms7aqn63iknroi4op.apps.googleusercontent.com', '291863698243-tlnq2ahg1kbav1alv0n5flhdqhjgkcpp.apps.googleusercontent.com'],
    });
    const payload = ticket.getPayload();
    const user: Scouter = {
      id: payload.sub.toString(),
      name: payload.name.toString(),
      email: payload.email.toString(),
      team: await dbHandler.getUserTeam(db, payload.sub.toString()),
      provider: 'google',
    }
    if (!user.team && force_team) {
      const return_val: AuthResult = { success: false, status: StatusCodes.not_authorized, reason: 'User is not registered to a team.' }
      return return_val;
    }
    const return_val: AuthResult = { success: true, user }
    return return_val;
  } catch (e) {
    console.error(`Could not get payload from ticket for reason: ${e}`);
    const return_val: AuthResult = { success: false, status: StatusCodes.not_authorized, reason: 'User could not be authenticated.' }
    return return_val;
  }
}

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
  if (!req.header('Authorization')) {
    return res.status(StatusCodes.not_authorized).json({
      success: false,
      reason: 'Authentication credentials were not provided.',
    });
  }
  const bearerHeader = req.header('Authorization').split(' ');
  const googleAuthResult: AuthResult = await checkBearerToken(bearerHeader, req.db);
  if (!googleAuthResult.success) {
    return res.status(googleAuthResult.status).json({
      success: false,
      reason: googleAuthResult.reason,
    })
  }
  res.locals = Object.assign(res.locals, googleAuthResult.user);

  return next();
};

export const checkAuth = async (req: any, res: any, next: any): Promise<void> => {
  checkAuthWrapped(req, res, next, true)
}

export const noAPIKey = async (req, res, next) => {
  if (req.query.CLIENT_ID || req.query.CLIENT_SECRET) {
    res.status(StatusCodes.no_key_auth);
    res.json({ success: false, reason: 'This route does not allow authentication via API key' });
  }
  next();
};

export const checkAuthNoTeam = async (req: any, res: any, next: any): Promise<void> => {
  checkAuthWrapped(req, res, next, false);
};

// after this point, res.locals now contains validated information about the user.
