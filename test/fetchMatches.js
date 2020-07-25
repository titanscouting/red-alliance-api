process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the /GET route
  */
describe('/GET /api/fetchMatches', () => {
  it('it should GET the number of scouters for each match', (done) => {
    chai.request(server)
      .get('/api/fetchMatches?competition=2020ilch')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.eql({"success":true,"competition":"2020ilch","data":[6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,4,2,2,3,2,2,1,1,1,0,1,0,1,1,1,0,0,0,0,0,0,0,0,2,1,0,0]})
        done();
      });
  });
});
