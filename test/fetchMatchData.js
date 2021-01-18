process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/fetchMatchData', () => {
  it('it should GET the data for a match and team', (done) => {
    chai.request(server)
      .get('/api/fetchMatchData?competition=2020ilch&match=1&team_scouted=8160')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.match.should.eql(1);
        res.body.should.have.property('success').eql(true);
      });
      chai.request(server)
      .get('/api/fetchMatchData')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});
