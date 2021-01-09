process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET/api/fetchMatchDataAllTeams', () => {
  it('it should GET the match data for all teams', (done) => {
    chai.request(server)
      .get('/api/fetchMatchDataAllTeams?competition=2020ilch')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.should.have.property('success').eql(true);
      });
      chai.request(server)
      .get('/api/fetchMatchDataAllTeams')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});
