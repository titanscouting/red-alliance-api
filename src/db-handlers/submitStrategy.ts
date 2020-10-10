import UserReturnData from '../routes/UserReturnData';

export default async (db, scouterin, matchin, compin, datain): Promise<UserReturnData> => {
  const data: UserReturnData = { err_occur: false, err_reasons: [], data: {} };

  const dbo = db.db('strategies');
  const myobj = {
    $set: {
      scouter: scouterin, competition: compin, match: matchin, data: datain,
    },
  };
  try {
    await dbo.collection('data').updateOne({ _id: compin + scouterin + matchin }, myobj, { upsert: true });
  } catch (err) {
    data.err_occur = true;
    data.err_reasons.push(err);
    console.error(err);
  }
  return data;
};
