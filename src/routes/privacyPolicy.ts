module.exports = (app: any) => {
  app.get('/privacy-policy', (req: any, res:any) => {
    res.redirect('https://drive.google.com/a/imsa.edu/file/d/11_cAuaerCrQ3BBXNx_G_zw1ZyGaTWx0z/view?usp=sharing');
  });
};
