process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/fetchPitVariableData', () => {
  it('it should GET the data for the pit variables', (done) => {
    chai.request(server)
      .get('/api/fetchPitVariableData?competition=2020ilch')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('data');
        res.body.data.should.have.property('wheel-mechanism');
        res.body.data.should.have.property('low-balls');
        res.body.data.should.have.property('high-balls');
        res.body.should.have.property('success').eql(true);
      });
      chai.request(server)
      .get('/api/fetchPitVariableData')
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});
