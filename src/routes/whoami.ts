import Scouter from "./Scouter";

// Allow a client to determine the username and id of a user. 
module.exports = (app: any, auth: any) => {
    app.get('/api/whoami', auth.checkAuth, async (req: any, res:any) => {
        let scouter: Scouter = {id: res.locals.id, name: res.locals.name};
        res.json({success: true, data: scouter})
    }
}