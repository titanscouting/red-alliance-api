process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const expect = chai.expect;

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/nonexistentroute', () => {
  it('it should GET a 404 status', (done) => {
    chai.request(server)
      .get('/api/nonexistentroute')
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});
