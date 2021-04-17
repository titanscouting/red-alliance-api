module.exports = (app: any) => {
  app.get('/', async (req: any, res:any) => {
    res.redirect('/docs/')
  })
}
