const agent = require('superagent');
require('dotenv').config();
const { expect } = require('chai');

describe('Github PUT api tests', () => {
  it('Follow aperdomo user', async () => {
    const url = 'https://api.github.com/user/following/aperdomob';
    const res = await agent
      .put(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    expect(res.status).to.equal(204);
    expect(res.body).to.eql({});
  });

  it('Check following aperdomob', async () => {
    const followUrl = 'https://api.github.com/user/following';
    const res = await agent
      .get(followUrl)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    expect(res.body).to.be.an('array');
    const expectedUser = res.body.find(
      (element) => element.login === 'aperdomob'
    );
    expect(expectedUser).to.be.an('object');
    expect(expectedUser.login).to.equal('aperdomob');
  });

  it('Check idempotent of put method', async () => {
    const url = 'https://api.github.com/user/following/aperdomob';
    const res = await agent
      .put(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    expect(res.status).to.equal(204);
    expect(res.body).to.eql({});
  });
});
