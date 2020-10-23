process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();


chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET/api/findTeamNickname', () => {
  it('it should GET the team nickname for a team', (done) => {
    chai.request(server)
      .get('/api/findTeamNickname?team_number=2022')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('data').eql({team_nickname: "Titan Robotics"});
        done();
      });
  });
});
describe('/GET /api/findTeamNickname', () => {
  it('it should fail to GET the team nickname for a team', (done) => {
    chai.request(server)
      .get('/api/findTeamNickname')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});