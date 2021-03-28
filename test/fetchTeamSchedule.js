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
      .get(`/api/fetchTeamSchedule?competition=2020ilch&CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.should.have.property('success').eql(true);
        done();
      });
  });
});