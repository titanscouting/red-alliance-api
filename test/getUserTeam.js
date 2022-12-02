process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GET route
  */
describe('GET /api/getUserTeam', () => {
  it("it should GET the API User's team", (done) => {
    chai.request(server)
      .get(`/api/getUserTeam?CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('id').equals(process.env.TRA_CLIENTID);
        res.body.should.have.property('team').equals("2022");
        res.body.should.have.property('name').equals("API User");
        res.body.should.have.property('success').eql(true);
        done();
      });
  });
});
