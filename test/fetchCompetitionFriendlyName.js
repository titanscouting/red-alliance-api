process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/fetchCompetitionFriendlyName', () => {
  it('it should GET the friendly name for a given competition identifer', (done) => {
    chai.request(server)
      .get('/api/fetchCompetitionFriendlyName?competition=2020ilch')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.eql({"success":true,"competition":"2020ilch","data":{"friendlyName":"2020 Midwest Regional"}});
        res.body.should.have.property('success').eql(true);
        done();
      });
  });
});
