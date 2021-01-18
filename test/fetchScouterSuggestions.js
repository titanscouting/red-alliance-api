process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET/api/fetchScouterSuggestions', () => {
  it('it should GET the scouting suggesions for a match number and competition', (done) => {
    chai.request(server)
      .get('/api/fetchScouterSuggestions?competition=2020ilch&match=2')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.eql({ 'success':true,'competition':'2020ilch','match':2,'data':[{'scouter':'Alexander Wells','strategy':'They were bricked the whole match'},{'scouter':'Jacob Levine','strategy':'It\'s a potato with mechanical problems. Might be useful if they fix them, but for now just slow defense'},{'scouter':'Julie Lima','strategy':'I don’t know how this robot can actually perform because their connection did not work, so the robot didn’t move at all.' }]});
        res.body.should.have.property('success').eql(true);
        done();
      })
  });
});
describe('/GET /api/fetchScouterSuggestions', () => {
  it('it should FAIL to GET the scouting suggesions for a match number and competition', (done) => {
    chai.request(server)
        .get('/api/fetchScouterSuggestions?match=2')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('success').eql(false);
          done();
        });
      })
});

