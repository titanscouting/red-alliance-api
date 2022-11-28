/**
 * Handles authentication of API requests through various providers (currently Google and API keys)
 * @module authHandler
 */

import './dbHandler';
import StatusCodes from './StatusCodes';
import { checkAuthWrapped } from './auth-handlers/common';

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
