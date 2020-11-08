module.exports = (app: any) => {
  app.get('/privacy-policy', (req: any, res:any) => {
    res.sendFile('/public/privacy-policy.pdf');
  });
};
