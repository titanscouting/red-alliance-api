import path from 'path';

module.exports = (app: any) => {
  app.get('/privacy-policy', (req: any, res:any) => {
    res.sendFile(path.join(__dirname, '/../../public/privacy-policy.pdf'));
  });
};
