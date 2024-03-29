process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/fetchStrategy', () => {
  it('it should GET the strategies for a match', (done) => {
    chai.request(server)
      .get(`/api/fetchStrategy?competition=2020ilch&match=12&CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.eql({"success":true,"data":[{"_id":"2020ilchJacob Levine12","data":"7560- useless, use for defense\n2022- us, score/hang/defense\n2151- check up on scoring, but likely defense\n\n3734- stuck during match 1 teleop, so competency is unknown\n5934- easy target for defense, but scoring isn't great (accuracy low and balls hit partner's balls)\n8029- very limited","scouter":"Jacob Levine"}]})
      });
      chai.request(server)
      .get(`/api/fetchStrategy?CLIENT_ID=${process.env.TRA_CLIENTID}&CLIENT_SECRET=${process.env.TRA_CLIENTSECRET}`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('success').equal(false);
        done();
      });
  });
});
