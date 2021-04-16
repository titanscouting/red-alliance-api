process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);
chai.use(require('chai-json'));

/*
  * Test the GETroute
  */
 function isJson(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

describe('GET /api/fetchAPIConfig', () => {
  it('it should GET the OpenAPI API specification', (done) => {
    chai.request(server)
      .get('/api/fetchAPIConfig')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.servers).to.be.an('array');
        // make sure that each screen has a valid config
        for (const path of res.body.paths) {
          expect(isJson(JSON.stringify(path))).to.eql(true);
        }
        done();
      });
  });
});
