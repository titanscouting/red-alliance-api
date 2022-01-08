process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);

/*
  * Test the POST route
  */
describe('POST /api/setAnalysisFlags', () => {
    it('It should add the flag with name flag to data', (done) => {
      chai.request(server)
        .post(`/api/setAnalysisFlags?CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({flag: 'test_flag',
      data: true})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('success').eql(true)
        done();
      });
  });
});
