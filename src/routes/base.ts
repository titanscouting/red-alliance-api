/**
 * GET route '/'
 * Base route; allows the frontend application and/or developer to sanity check
 * to ensure the API is live.
 * @returns HTTP Status Code 200 OK
 */

module.exports = (app: any) => {
    app.get('/', (req: any, res:any) => {
        res.send('The Red Alliance API. Copyright 2020 Titan Scouting.');
        res.status(200);
    });
}