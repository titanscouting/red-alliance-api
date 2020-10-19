process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the /GET route
  */
describe('GET /api/fetchPitData', () => {
  it('it should GET the pit data for a given team', (done) => {
    chai.request(server)
      .get('/api/fetchPitData?competition=2020ilch&team_scouted=63')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.eql({"success":true,"competition":"2020ilch","teamScouted":63,"data":{"wheel-mechanism":"Yes","match-updated":0,"low-balls":"Yes","high-balls":"No","strategic-focus":"Offense","climb-mechanism":"x1","climb-requirements":"5 seconds ","attitude":"Positive","defense-notes":"Auto 11-15 points from 3-4 lower balls","wheel-success":"Don't Know"}})
      });
      chai.request(server)
      .get('/api/fetchPitData?competition=2020ilch&team_scouted=200000')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('success').eql(false);
      });
      chai.request(server)
      .get('/api/fetchPitData')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});
