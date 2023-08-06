import { validate, Joi } from 'express-validation';
import Scouter from '../Scouter';

/**
* POST route '/api/broadcastTeamMessage'
* Allows a team member to broadcast a message to all members of the team.
* @param message is the message to broadcast.
* @returns back to the client let resobj (success status) and HTTP Status Code 200 OK.
*/

module.exports = (app: any, auth: any) => {
  const validation = {
    body: Joi.object({
      message: Joi.string().required(),
    }),
  }
  app.post('/api/broadcastTeamMessage', auth.noAPIKey, auth.checkAuth, validate(validation, { keyByField: true }, { allowUnknown: true }), auth.checkAuth, async (req: any, res:any) => {
    const broadcastAdmin: Scouter = { name: String(res.locals.name), id: String(res.locals.id), team: res.locals.team };
    const message = String(req.body.message);
    console.log(`${String(broadcastAdmin.team)}_broadcastMessage`)
    res.locals.io.sockets.emit(`${String(broadcastAdmin.team)}_broadcastMessage`, {
      admin: broadcastAdmin.name, message,
    })
    res.json({
      success: true,
    });
  });
};
