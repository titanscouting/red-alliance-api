import StatusCodes from "../StatusCodes";

module.exports = (app: any) => {
  app.get('/api/fetchAPIConfig', async (req: any, res:any) => {
    try {
        const apiConfig = require('./swagger.json')
        res.json(apiConfig);
    } catch {
        res.status(StatusCodes.no_data).json({success: false, reasons:["Could not read Swagger definition file"]})
    }

  });
};
