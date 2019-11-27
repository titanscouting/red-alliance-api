const {OAuth2Client} = require('google-auth-library');

CLIENT_ID = "310664675151-5en2tm8rm9m6fjemifs1a06au02n8g8k.apps.googleusercontent.com"

const client = new OAuth2Client(CLIENT_ID);
module.exports.checkAuth = async (req, res, next) => {
  const ticket = await client.verifyIdToken({
    idToken:   String(req.header('token')),
    audience: CLIENT_ID,
    // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
}).catch(err => {console.error(err); res.status(401);});
  try {
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log(userid)
  }
  catch (e) {
    console.error("Could not get payload from ticket")
    res.status(403)
  }

  next()
}

// after this point, the token has now been verified as valid and the userid can be treated as a unique identifier for a google user.