process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { passportJwtSecret } = require('jwks-rsa');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);

/*
  * Test the POST route
  */
describe('POST /api/submitTeamTestsData', () => {
    it('it should POST the team tests data for a team', (done) => {
      chai.request(server)
        .post('/api/submitTeamTestsData')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({team_number: '2022',
        competition: '2020ilch',
      data: {test: true}})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('team_number');
        res.body.should.have.property('competition');
        res.body.should.have.property('data');
        res.body.should.have.property('success').eql(true)
        done();
      });
  });
});
