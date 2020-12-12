process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const should = chai.should();

chai.use(chaiHttp);
chai.request('localhost:8000').post('/api/submitStrategy')
    // .field('myparam' , 'test')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({ CLIENT_ID: 'b15ac9da-0b76-4e38-8423-2f0e2bc0d443&' })
    .send({ CLIENT_SECRET: 'P5DCKPJ-1DV4WE4-GGHJY3Q-5F0D8GW' })
    
