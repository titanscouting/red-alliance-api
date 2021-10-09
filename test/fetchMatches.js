process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/fetchScouters', () => {
  it('it should GET the number of scouters for each match', (done) => {
    chai.request(server)
      .get(`/api/fetchScouters?competition=2020ilch&CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(true);
        res.body.should.have.property('data').with.lengthOf(90);
      });
      chai.request(server)
      .get('/api/fetchScouters')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('success').equal(false);
        done();
      });
  });
});
