import UserReturnData from '../UserReturnData';
import StatusCodes from '../StatusCodes';

/**
 * GET route '/api/fetchScouterSuggestions'
 * Allows the application to fetch the suggestions that a scouter made for a match (presumably one that Titan Robotics is part of, or else why would they make suggestions?).
 * @param competition is the identifier for the competition: e.g. '2020ilch'.
 * @param matchNumber is the number of the match scouted: e.g. '1'.
 * @returns back to the client let resobj (competition id, match number, and reccoemendation) and HTTP Status Code 200 OK.
 */
module.exports = (app: any, dbHandler: any) => {
  app.get('/api/fetchScouterSuggestions', async (req: any, res:any) => {
    const { competition }: Record<string, string> = req.query;
    let { matchNumber }: Record<string, any> = req.query;
    matchNumber = parseInt(matchNumber, 10);
    const val: UserReturnData = new UserReturnData();
    let dataInterim: Record<string, unknown>;
    if ((competition === undefined || matchNumber === undefined)) {
      val.err_occur = true;
      val.err_reasons.push('A required parameter (competition ID or match number) was not provided')
    } else {
      val.data = await dbHandler.fetchScouterSuggestions(req.db, competition, matchNumber).catch((e) => { console.error(e); val.err_occur = true; });
      dataInterim = val.data.data;
    }
    if (val.err_occur === false) {
      res.json({
        success: true,
        competition,
        matchNumber,
        data: dataInterim,
      });
    } else {
      res.status(StatusCodes.no_data).json({
        success: false,
        reasons: val.err_reasons,
      });
    }
  });
};
