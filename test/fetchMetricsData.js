process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/fetchMetricsData', () => {
  it('it should GET the metrics data for a team', (done) => {
    chai.request(server)
      .get('/api/fetchMetricsData?competition=2020ilch&team_number=8160')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('metrics');
        res.body.competition.should.eql('2020ilch');
        res.body.should.have.property('success').eql(true);
      });
      chai.request(server)
      .get('/api/fetchMetricsData')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});
