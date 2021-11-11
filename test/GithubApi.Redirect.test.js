const agent = require('superagent');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

describe('Github HEAD api tests', () => {
  const url = 'https://github.com/aperdomob/redirect-test';
  const currentRedirect = 'https://github.com/aperdomob/new-redirect-test';
  it('Head old url', async () => {
    try {
      await agent
        .head(url)
        .set('User-Agent', 'agent');
    } catch (error) {
      expect(error.status).to.equal(StatusCodes.MOVED_PERMANENTLY);
      expect(error.response.headers.location).to.equal(currentRedirect);
    }
  });

  it('check new url', async () => {
    try {
      await agent
        .get(url)
        .set('User-Agent', 'agent');
    } catch (error) {
      expect(error.status).to.equal(StatusCodes.MOVED_PERMANENTLY);
      expect(error.url).to.equal(currentRedirect);
    }
  });
});
