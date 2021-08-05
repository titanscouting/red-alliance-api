process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

chai.use(chaiHttp);
/*
  * Test the GET route
  */
describe('GET /api/fetchAnalysisFlags', () => {
  it('it should GET the data for the flag', (done) => {
    chai.request(server)
      .get(`/api/fetchAnalysisFlags?flag=latest_update&CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.should.have.property('flag').eql("latest_update");
        res.body.should.have.property('data').to.be.a('number');
        res.body.should.have.property('success').eql(true);
      });
      chai.request(server)
      .get('/api/fetchAnalysisFlags')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});
