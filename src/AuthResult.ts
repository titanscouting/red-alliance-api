/**
 * @memberOf module:authHandler
 * @desc Represents the final authentication result returned from the authentication flow.
 * @author Dev Singh <dsingh@imsa.edu>
 * @license BSD-3-Clause
 */

import Scouter from "./Scouter";

 export interface AuthResult {
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