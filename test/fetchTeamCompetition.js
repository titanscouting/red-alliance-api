process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/fetchTeamCompetition', () => {
  it('it should GET the current competition for the team', (done) => {
    chai.request(server)
      .get(`/api/fetchTeamCompetition?&CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('team').eql("2022");
        res.body.should.have.property('competition').eql("2022ilch");
        res.body.should.have.property('success').eql(true);
        done();
      });
  });
});

