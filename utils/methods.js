const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
module.exports.checkAuth = (req, res, next) => {
  
  const ticket = await client.verifyIdToken({
    idToken:   req.header('authorization'),
    CLIENT_ID: ["*"]
    // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
});
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  const domain = payload['hd'];
  next()
}

// after this point, the token has now been verified as valid and the userid can be treated as a unique identifier for a google user. 