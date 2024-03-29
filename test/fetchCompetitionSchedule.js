process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/fetchCompetitionSchedule', () => {
  it('it should GET the schedule for all the matches in a day', (done) => {
    chai.request(server)
      .get(`/api/fetchCompetitionSchedule?competition=2020ilch&CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data[0].match.should.eql(1);
        res.body.data[0].time.should.eql('2020-03-06T15:07:51.000Z');
        res.body.should.have.property('success').eql(true);

      });
      // do it again to check the cache
      chai.request(server)
      .get(`/api/fetchCompetitionSchedule?competition=2020ilch&CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data[0].match.should.eql(1);
        res.body.data[0].time.should.eql('2020-03-06T15:07:51.000Z');
        res.body.should.have.property('success').eql(true);

      });
      chai.request(server)
      .get(`/api/fetchCompetitionSchedule?CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});
