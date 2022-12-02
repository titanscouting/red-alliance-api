process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../src/index.ts');

const expect = chai.expect;

chai.use(chaiHttp);
/*
  * Test the GETroute
  */
describe('GET /api/getUserTeam', () => {
  it('it should fail to authorize an expired Google token', (done) => {
    chai.request(server)
      .get('/api/getUserTeam')
      .set('Authorization', "Bearer eyJhbGciOiJSUzI1NiIsjmtpZCI6IjE4MzkyM2M4Y2ZlYzEwZjkyY2IwMTNkMDZlMWU3Y2RkNzg3NGFlYTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiMjkxODYzNjk4MjQzLTRicDVkODZrNm1vNWRrNWllZjl2ZTlycTZkN2wxZm9iLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiMjkxODYzNjk4MjQzLTRicDVkODZrNm1vNWRrNWllZjl2ZTlycTZkN2wxZm9iLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE0OTc5MTIzMzYwODgwMTIxMzM4IiwiaGQiOiJpbXNhLmVkdSIsImVtYWlsIjoiZHNpbmdoQGltc2EuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJsbThLVVFVcklKTHlTZ3d6YXpGRmNnIiwibmFtZSI6IkRldiBTaW5naCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BTG01d3UwT2V2ZUF0NWRHMHhGbmpBOGJmWVBfX3JRUXcyaXJHWGpHVWczNndRPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkRldiIsImZhbWlseV9uYW1lIjoiU2luZ2giLCJsb2NhbGUiOiJlbiIsImlhdCI6MTY2OTkzNjkzMywiZXhwIjoxNjY5OTQwNTMzLCJqdGkiOiIyZWUxOGNjMDhjNzE5NmM4NGE5YTU0YzI0NTI2NGU5NWE1MzJlNTdkIn0.UKOhP6YTWSToB3os60N8cGb-ITAvW6HkK2O4QLaS935zJwV6WIB-E17nKotxCNN6LZ1NPox9YL8TDCKTTnDsrDCZu_BaICV8dMaVAkHrW2gvt4LdY3vRkxt7GdcTNc6yD5pCx3inHTYNDVmYcxnWW6P4kjKKWqhqJPTEsQ1LAn628xZSX50YrkOxaiymZuz9uOQ6WkBjTHO9aMHka-SxPpJQCxwOBjRys69juqUdDxWQRkxkcaj6YhTcqVyQlciAgK29SgQn1dV7kogdQyQCNLHSaaP5Dp5UZ2sM4g38JV2ZG9Xq0gPxAwUDhpSF3-ya1MZkRiTXGRUfq-5EDxB9Zg")
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('success').eql(false);
        done();
      });
  });
});
