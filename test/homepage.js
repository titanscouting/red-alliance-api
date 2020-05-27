process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../built/index.js');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the /GET route
  */
describe('/GET /', () => {
  it('it should GET the homepage', (done) => {
    chai.request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});
