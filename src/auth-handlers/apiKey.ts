/**
 * @memberOf module:authHandler
 * @desc Handles API Key-specific authentication logic
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 */


/**
 * Verifies that a CLIENT_ID and CLIENT_SECRET pair are correct and valid. Usually used instead of JWT authentication. 
 * @memberOf module:authHandler
 * @param id CLIENT_ID from the user
 * @param secret CLIENT_SECRET from the user. 
 * @param db instance of the DB client.
 * @param force_team if true, requires the user to be part of the team. set to false when enrolling new users as they will not be part of a team
 * @returns AuthResult instance describing the final authentication result.
 */
import { checkKey, getUserTeam } from "../dbHandler";
import { AuthResult } from "../AuthResult";
import Scouter from "../Scouter";
import StatusCodes from "../StatusCodes";

export const checkAPIKey = async (id: string, secret: string, db: any, force_team = true): Promise<AuthResult> => {
    const isAuthorized = await checkKey(db, id, secret);
    if (isAuthorized) {
        const team = await getUserTeam(db, id);
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