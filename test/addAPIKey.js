process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the POST route
  */
describe('POST /api/addAPIKey', () => {
  it('it should POST to create an API Key', (done) => {
    let CLIENT_ID;
    let CLIENT_SECRET;
    chai.request(server)
      .post(`/api/addAPIKey?CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('CLIENT_ID');
        res.body.should.have.property('CLIENT_SECRET');
        done();
      });
  });
});
