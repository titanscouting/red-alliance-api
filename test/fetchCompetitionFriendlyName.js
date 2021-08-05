process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const expect = chai.expect;

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/fetchCompetitionFriendlyName', () => {
  it('it should GET the friendly name for a given competition identifer', (done) => {
    chai.request(server)
      .get('/api/fetchCompetitionFriendlyName?competition=2020ilch')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success')
          .eql(true);
        expect(res.body.data.friendlyName)
          .to
          .be
          .a('string')
        done();
      });
  });
});
