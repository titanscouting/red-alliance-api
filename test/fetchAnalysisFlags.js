process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET/api/fetchAnalysisFlags', () => {
  it('it should GET the data for the flag', (done) => {
    chai.request(server)
      .get('/api/fetchAnalysisFlags?flags=1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.should.have.property('success').eql(true);
      });
      chai.request(server)
      .get('/api/fetchAnalysisFlags')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});
