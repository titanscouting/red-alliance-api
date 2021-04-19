import StatusCodes from '../StatusCodes';
import swaggerDefinition = require('../api-docs/index');

module.exports = (app: any) => {
  app.get('/api/fetchAPIConfig', async (req: any, res:any) => {
    try {
      res.json(swaggerDefinition.default)
    } catch {
      res.status(StatusCodes.no_data).json({ success: false, reasons: ['Could not read Swagger definition file'] })
    }
  });
};
