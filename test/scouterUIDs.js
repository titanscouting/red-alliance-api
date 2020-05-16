process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../index.js');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the /GET route
  */
describe('/GET /api/fetchScouterUIDs', () => {
  it('it should GET the users who are scouting a match', (done) => {
    chai.request(server)
      .get('/api/fetchScouterUIDs?competition=2020ilch&match_number=1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.eql({
          success: true,
          competition: '2020ilch',
          scouters: [
            { name: 'Shawn Coutinho', id: '100874915124225740000' },
            { name: 'Liam Nelson', id: '109531456606510070000' },
            { name: 'Sachin Vijayaraj', id: '104481238308818200000' },
            { name: 'Jacob Levine', id: '118006453012298350000' },
            { name: 'Sarah Oquendo', id: '116902796378120080000' },
            { name: 'Alexander Wells', id: '113332350115233820000' },
          ],
          teams: ['5350', '5133', '3734', '63', '1675', '8160'],
        });
        console.log(res.body);
        done();
      });
  });
});
