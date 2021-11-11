const agent = require('superagent');
require('dotenv').config();
const { expect } = require('chai');

describe('Github POST api tests', () => {
  let authUser = {};
  let publicRepo = {};
  let currentIssue = {};

  it('Get auth user', async () => {
    const url = 'https://api.github.com/user';
    const res = await agent
      .get(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    expect(res.status).to.equal(200);
    authUser = res.body;
  });

  it('Search a public repo', async () => {
    const res = await agent
      .get(authUser.repos_url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an('array');
    const repoFound = res.body.find(
      (element) => element.private === false && element.name === 'workshop-api-testing-js'
    );
    expect(repoFound).to.be.an('object');
    publicRepo = repoFound;
  });

  it('Create an issue', async () => {
    const postUrl = `https://api.github.com/repos/${authUser.login}/${publicRepo.name}/issues`;
    const res = await agent
      .post(postUrl)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent')
      .send({ title: 'issue' });

    expect(res.body).to.be.an('object');
    expect(res.body.title).to.equal('issue');
    expect(res.body.body).to.equal(null);
    currentIssue = res.body;
  });

  it('Update current issue', async () => {
    const url = `https://api.github.com/repos/${authUser.login}/${publicRepo.name}/issues/${currentIssue.number}`;
    const descriptionText = 'automated description';
    const res = await agent
      .patch(url)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent')
      .send({ body: descriptionText });
    expect(res.body).to.be.an('object');
    expect(res.body.body).to.equal(descriptionText);
  });
});
