import UserReturnData from './UserReturnData';

/**
 * GET route '/api/fetchScouterSuggestions'
 * Allows the application to fetch the suggestions that a scouter made for a match (presumably one that Titan Robotics is part of, or else why would they make suggestions?).
 * @param competition is the identifier for the competition: e.g. '2020ilch'.
 * @param matchNumber is the number of the match scouted: e.g. '1'.
 * @returns back to the client let resobj (competition id, match number, and reccoemendation) and HTTP Status Code 200 OK.
 */
module.exports = (app: any, dbHandler: any) => {
  app.get('/api/fetchScouterSuggestions', async (req: any, res:any) => {
    const val: UserReturnData = new UserReturnData();
    const competition = String(req.query.competition);
    const matchNumber = parseInt(req.query.match_number, 10);
    try {
      val.data = await dbHandler.fetchScouterSuggestions(req.db, competition, matchNumber).catch((e) => { console.error(e); val.err_occur = true; });
    } catch (err) {
      console.error(err);
      val.err_occur = true;
    }
    let dataInterim: Record<string, unknown>;
    try {
      dataInterim = val.data.data;
    } catch (e) {
      val.err_occur = true;
    }
    let resobj = null;
    if (val.err_occur === false) {
      resobj = {
        success: true,
        competition,
        matchNumber,
        data: dataInterim,
      };
    } else {
      resobj = {
        success: false,
        reasons: val.err_reasons,
      };
    }
    res.json(resobj);
  });
};
