process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the /GET route
  */
describe('/GET /api/fetchMatchData', () => {
  it('it should GET the data for a match and team', (done) => {
    chai.request(server)
      .get('/api/fetchMatchData?competition=2020ilch&match_number=1&team_scouted=8160')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data._id.should.eql('2020ilch18160');
        res.body.data.match.should.eql(1);
        res.body.should.have.property('success').eql(true);
      });
      chai.request(server)
      .get('/api/fetchMatchData')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});
