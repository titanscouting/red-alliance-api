process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/fetchTeamTestsData', () => {
  it('it should GET the analysis data for a team and competition', (done) => {
    chai.request(server)
      .get(`/api/fetchTeamTestsData?competition=2020ilch&team=2022&CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.data).to.be.an('object');
        res.body.team.should.eql('2022');
        res.body.should.have.property('success').eql(true);
      });
      chai.request(server)
      .get('/api/fetchTeamTestsData')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});
