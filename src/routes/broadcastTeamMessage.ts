import { validate, Joi } from 'express-validation';
import Scouter from '../Scouter';

module.exports = (app: any, dbHandler: any, auth: any) => {
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
