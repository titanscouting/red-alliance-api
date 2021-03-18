import StatusCodes from "../StatusCodes";
import path from 'path';

module.exports = (app: any) => {
  app.get('/api/fetchAPIConfig', async (req: any, res:any) => {
    try {
      res.header("Content-Type",'application/json');
      const p = path.resolve('src/routes/swagger.json')
      res.sendFile(p);
    } catch {
        res.status(StatusCodes.no_data).json({success: false, reasons:["Could not read Swagger definition file"]})
    }

  });
};
