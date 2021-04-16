process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { passportJwtSecret } = require('jwks-rsa');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);

/*
  * Test the POST route
  */
describe('POST /api/setAnalysisFlags', () => {
    it('It should add the flag with name flag to data', (done) => {
      chai.request(server)
        .post('/api/setAnalysisFlags')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({flag: '2022',
      data: {test: true}})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('flag');
        res.body.should.have.property('success').eql(true)
        done();
      });
  });
});
