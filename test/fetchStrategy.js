process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the /GET route
  */
describe('/GET /api/fetchStrategy', () => {
  it('it should GET the strategies for a match', (done) => {
    chai.request(server)
      .get('/api/fetchStrategy?competition=2020ilch&match=10')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success').eql(true);
        done();
      });
  });
});
