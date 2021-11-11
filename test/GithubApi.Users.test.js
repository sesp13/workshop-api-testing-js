const agent = require('superagent');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

describe('Github query api tests', () => {
  const url = 'https://api.github.com/users';
  it('Default user request', async () => {
    const res = await agent.get(url).set('User-Agent', 'agent');
    expect(res.status).to.equal(StatusCodes.OK);
    expect(res.body.length).to.equal(30);
  });

  it('User request with 10 users', async () => {
    const res = await agent
      .get(url)
      .set('User-Agent', 'agent')
      .query({ per_page: 10 });
    expect(res.status).to.equal(StatusCodes.OK);
    expect(res.body.length).to.equal(10);
  });

  it('User request with 50 users', async () => {
    const res = await agent
      .get(url)
      .set('User-Agent', 'agent')
      .query({ per_page: 50 });
    expect(res.status).to.equal(StatusCodes.OK);
    expect(res.body.length).to.equal(50);
  });
});
