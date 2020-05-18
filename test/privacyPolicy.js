process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../index.js');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the /GET route
  */
describe('/GET /privacy-policy', () => {
  it('it should GET the privacy policy', (done) => {
    chai.request(server)
      .get('/privacy-policy')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});