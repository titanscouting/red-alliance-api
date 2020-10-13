process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET/api/fetchAllTeamNicknamesAtCompetition', () => {
  it('it should GET the scouting suggesions for a match number and competition', (done) => {
    chai.request(server)
      .get('/api/fetchAllTeamNicknamesAtCompetition?competition=2020ilch')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.eql({
          success: true,
          competition: '2020ilch',
          data: {
            63: 'McDowell Robotics Team 63',
            101: 'Striker',
            111: 'WildStang',
            930: 'Mukwonago BEARs',
            1625: 'Winnovation',
            1675: 'UPS (Ultimate Protection Squad)',
            1732: 'Hilltoppers',
            1739: 'Chicago Knights',
            1756: 'Argos',
            1781: 'Lindblom Electric Eagles',
            2022: 'Titan Robotics',
            2039: 'Rockford Robotics',
            2136: 'Impossible Mission Force',
            2151: 'Monty Pythons',
            2338: 'Gear It Forward',
            2358: 'Bearbotics',
            2451: 'PWNAGE',
            2725: 'Ice Princesses',
            3061: 'Huskie Robotics',
            3067: 'Robovikes',
            3110: 'SeaBots',
            3197: 'HexHounds',
            3352: 'Flaming Monkeys 4-H Robotics Club',
            3410: 'Miami MEngs',
            3488: 'Eagle Army',
            3734: 'Caxys',
            4096: 'Ctrl-Z',
            4191: 'IMC',
            4241: 'Joliet Cyborgs ',
            4292: 'PorterBots',
            4296: 'Trident Robotics',
            4645: 'The Chicago Style BotDogs',
            4702: 'CyberDoggz',
            4787: 'Axiom',
            5125: 'Hawks on the Horizon',
            5133: 'PrepaTec - Blue Steel',
            5148: 'New Berlin Blitz',
            5350: 'Hope Robotics',
            5822: 'WolfByte',
            5847: 'Ironclad',
            5934: 'Crowbotics',
            6237: 'Martin Motion',
            6381: 'Red Raider Robotics',
            6906: 'Reybots',
            7237: 'UniBots',
            7411: 'CrossThreaded',
            7560: 'Doodle Bots',
            7608: 'Owlenators',
            8014: 'Fortitude Robotics',
            8029: 'Mustang Mafia',
            8096: 'Cache Money',
            8122: 'Robotic Eagles ',
            8160: 'Oly Rock Stars',
            8184: 'ROBOTTACK',
            _id: '5e5e7b43705c112b54434809',
            competition: '2020ilch',
          },
        });
        res.body.should.have.property('success').eql(true);
        done();
      });
  });
});
