import UserReturnData from '../UserReturnData';

module.exports = async (db: any, compID: string): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };
  const dbo = db.db('data_processing');
  const myobj = { competition: String(compID) };
  try {
    const out = {};
    const variablesSeen = [];
    const toProcess = await dbo.collection('team_pit').find(myobj).toArray();
    for (const element of toProcess) {
      if (variablesSeen.indexOf(element.variable) === -1) {
        out[`${element.variable}`] = {};
        variablesSeen.push(element.variable);
      }
      out[`${element.variable}`] = element.data;
    }
    data.data = out;
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err.toString());
    console.error(err);
  }
  return data;
};
