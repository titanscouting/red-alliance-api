/**
 * @memberOf module:authHandler
 * @desc Handles common authentication logic
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 */

import { AuthResult } from '../AuthResult';
import { checkAPIKey } from './apiKey';
import { checkGoogleToken } from './google';
import StatusCodes from '../StatusCodes';

/**
 * Wrapper function to bring the individual checking modules together. Selects the correct authentication method and runs the correct verification module.
 * @memberOf module:authHandler
 * @param req Express request
 * @param res Express response
 * @param next Express middleware next function
 * @param force_team Passes this value onto the correct module.
 * @see checkAPIKey
 * @see checkGoogleToken
 * @returns Express next()
 */

export const checkAuthWrapped = async (req: any, res: any, next: any, force_team = true): Promise<void> => {
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
  const googleAuthResult: AuthResult = await checkGoogleToken(bearerHeader, req.db, force_team);
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
