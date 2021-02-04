process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/fetchAllTeamPitData', () => {
  it('it should GET the pit data for all teams', (done) => {
    chai.request(server)
      .get('/api/fetchAllTeamPitData?competition=2020ilch')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.have.property('63');
        res.body.data.should.have.property('2022');
        res.body.should.have.property('success').eql(true);
      });
      chai.request(server)
      .get('/api/fetchAllTeamPitData?competition=2020ilch&teamScouted=63')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.have.property('63');
        res.body.data.should.not.have.property('2022');
        res.body.should.have.property('success').eql(true);
      });
      chai.request(server)
      .get('/api/fetchAllTeamPitData')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});
