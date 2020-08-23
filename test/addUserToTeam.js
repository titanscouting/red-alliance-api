process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('POST /api/addUserToTeam', () => {
  it('it should add a user to a specific FRC Team', (done) => {
    chai.request(server)
      .post(`/api/addUserToTeam?CLIENT_ID=${process.env.CLIENT_ID}&CLIENT_SECRET=${process.env.CLIENT_SECRET}`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({team: '2022'})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('name').eql('API User');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('id').eql(0);
        res.body.should.have.property('team').eql("2022");
        done();
      });
    chai.request(server)
      .post(`/api/addUserToTeam?CLIENT_ID=foo&CLIENT_SECRET=foo`)
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({team: '2022'})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(false);
      });
  });
});
