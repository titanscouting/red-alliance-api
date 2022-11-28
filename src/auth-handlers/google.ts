/**
 * @memberOf module:authHandler
 * @desc Handles Google-specific authentication logic
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 */

import './dbHandler';
import Scouter from '../Scouter';
import StatusCodes from '../StatusCodes'
import { AuthResult } from '../AuthResult';
import { OAuth2Client } from 'google-auth-library';
import { getUserTeam } from '../dbHandler';

/**
 * Verifies the bearer token with Google OAuth to ensure that the request comes from a legitimate, signed-in user (JWT authentication).
 * @async
 * @memberOf module:authHandler
 * @param bearerHeader Value of the Authorization header in the HTTP request. May or may not contain the string "Bearer" in front of the token.
 * @param db instance of DB client.
 * @param force_team if true, requires the user to be part of the team. set to false when enrolling new users as they will not be part of a team
 * @returns AuthResult instance describing the final authentication result.
 */

const CLIENT_ID = '291863698243-obu2fpbfpr7ul9db9lm7rmc1e4r3oeag.apps.googleusercontent.com';
const client: any = new OAuth2Client(CLIENT_ID);

export const checkGoogleToken = async (bearerHeader: Array<string>, db: any, force_team = true): Promise<AuthResult> => {
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
      team: await getUserTeam(db, payload.sub.toString()), // grab user <-> team assocation from database.
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