process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the /GET route
  */
describe('/GET /api/fetchMatches', () => {
  it('it should GET the number of scouters for each match', (done) => {
    chai.request(server)
      .get('/api/fetchMatches?competition=2020ilch')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('success').equal(true);
        res.body.should.have.property('data').with.lengthOf(90);
      });
      chai.request(server)
      .get('/api/fetchMatches')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('success').equal(false);
        done();
      });
  });
});
