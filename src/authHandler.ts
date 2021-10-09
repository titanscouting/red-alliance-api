/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import './dbHandler';
import StatusCodes from './StatusCodes';

const { OAuth2Client } = require('google-auth-library');
const dbHandler = require('./dbHandler');

const CLIENT_ID = '291863698243-obu2fpbfpr7ul9db9lm7rmc1e4r3oeag.apps.googleusercontent.com';
const client: any = new OAuth2Client(CLIENT_ID);
export const checkAuth = async (req: any, res: any, next: any): Promise<void> => {
  if (req.query.CLIENT_ID) {
    const isAuthorized = await dbHandler.checkKey(req.db, req.query.CLIENT_ID, req.query.CLIENT_SECRET);
    if (isAuthorized) {
      res.locals.id = req.query.CLIENT_ID;
      res.locals.name = 'API User';
      res.locals.team = '2022';
      return next();
    }
    res.status(StatusCodes.not_authorized);
    return res.json({
      success: false,
      reason: 'User could not be authenticated',
    });
  }
  const ticket = await client.verifyIdToken({
    idToken: String(req.header('token')),
    audience: [CLIENT_ID, '291863698243-4bp5d86k6mo5dk5ief9ve9rq6d7l1fob.apps.googleusercontent.com', '291863698243-eg5i4fh001n7sl28b0bqgp4h2vae9gn2.apps.googleusercontent.com', '291863698243-ofnqubd0fh5dqfhjo368c39uto1fmudt.apps.googleusercontent.com', '291863698243-obu2fpbfpr7ul9db9lm7rmc1e4r3oeag.apps.googleusercontent.com', '291863698243-ovppseib28p6usahf60igsp7ia3ovq6l.apps.googleusercontent.com', '291863698243-0dsmvs8uetpd9odms7aqn63iknroi4op.apps.googleusercontent.com'],
    // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  }).catch((err) => { console.error(err); res.status(401); });
  try {
    const payload = ticket.getPayload();
    res.locals.id = payload.sub.toString();
    res.locals.name = payload.name.toString();
    res.locals.email = payload.email.toString();
    res.locals.team = await dbHandler.getUserTeam(req.db, res.locals.id)
    if (res.locals.team == null) {
      res.status(StatusCodes.not_authorized);
      return res.json({
        success: false,
        reason: 'User is not registered to a team.',
      });
    }
  } catch (e) {
    console.error(`Could not get payload from ticket for reason: ${e}`);
    res.status(StatusCodes.not_authorized);
    return res.json({
      success: false,
      reason: 'User could not be authenticated',
    });
  }
  return next();
};

export const noAPIKey = async (req, res, next) => {
  if (req.query.CLIENT_ID || req.query.CLIENT_SECRET) {
    res.status(StatusCodes.no_key_auth);
    res.json({ success: false, reason: 'This route does not allow authentication via API key' });
  }

  next();
};

export const checkAuthNoTeam = async (req: any, res: any, next: any): Promise<void> => {
  if (req.query.CLIENT_ID) {
    const isAuthorized = await dbHandler.checkKey(req.db, req.query.CLIENT_ID, req.query.CLIENT_SECRET);
    if (isAuthorized) {
      res.locals.id = req.query.CLIENT_ID;
      res.locals.name = 'API User';
      res.locals.team = '2022';
    } else {
      res.status(StatusCodes.not_authorized);
      res.json({
        success: false,
        reason: 'User could not be authenticated',
      });
    }
  } else {
    const ticket = await client.verifyIdToken({
      idToken: String(req.header('token')),
      audience: [CLIENT_ID, '291863698243-4bp5d86k6mo5dk5ief9ve9rq6d7l1fob.apps.googleusercontent.com', '291863698243-eg5i4fh001n7sl28b0bqgp4h2vae9gn2.apps.googleusercontent.com', '291863698243-ofnqubd0fh5dqfhjo368c39uto1fmudt.apps.googleusercontent.com', '291863698243-obu2fpbfpr7ul9db9lm7rmc1e4r3oeag.apps.googleusercontent.com', '291863698243-ovppseib28p6usahf60igsp7ia3ovq6l.apps.googleusercontent.com', '291863698243-0dsmvs8uetpd9odms7aqn63iknroi4op.apps.googleusercontent.com'],
      // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    }).catch((err) => {
      console.error(err); return res.status(401).json({
        success: false,
        reason: 'User could not be authenticated',
      });
    });
    try {
      const payload = ticket.getPayload();
      res.locals.id = payload.sub.toString();
      res.locals.name = payload.name.toString();
      res.locals.email = payload.email.toString();
      res.locals.team = await dbHandler.getUserTeam(req.db, res.locals.id)
      res.locals.team = parseInt(res.locals.team, 10);
    } catch (e) {
      console.error(`Could not get payload from ticket for reason: ${e}`);
      res.status(StatusCodes.not_authorized);
      res.json({
        success: false,
        reason: 'User could not be authenticated',
      });
      return
    }
  }
  next();
};

// after this point, the token has now been verified as valid and 'res.locals.id'
// can be treated as a unique identifier for a google user.
