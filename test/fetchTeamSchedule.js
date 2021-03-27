process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/fetchTeamSchedule', () => {
  it('it should GET the schedule for 2022', (done) => {
    chai.request(server)
      .get('/api/fetchTeamSchedule?competition=2020ilch&team=2022')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.should.have.property('success').eql(true);
        done();
      });
  });
});
