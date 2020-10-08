process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET/privacy-policy', () => {
  it('it should GET the privacy policy', (done) => {
    chai.request(server)
      .get('/privacy-policy')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
