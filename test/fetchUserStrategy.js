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

describe('GET /api/fetchUserStrategy', () => {
  it(`it should GET the user's submitted match strategy`, (done) => {
    chai.request(server)
      .get(`/api/fetchUserStrategy?competition=2020ilch&match=7&CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        expect(res.body.data).to.be.an('array');
        done();
      });
  });
});
