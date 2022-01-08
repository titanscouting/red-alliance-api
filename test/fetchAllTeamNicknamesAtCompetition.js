process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET/api/fetchAllTeamNicknamesAtCompetition', () => {
  it('it should GET the scouting suggesions for a match number and competition', (done) => {
    chai.request(server)
      .get('/api/fetchAllTeamNicknamesAtCompetition?competition=2020ilch')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('data');
        res.body.data.should.have.property('3061');
        res.body.data.should.have.property('2022');
        res.body.should.have.property('success').eql(true);
        done();
      });
  });
});
