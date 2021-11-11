const agent = require('superagent');
const { expect } = require('chai');
const crypto = require('crypto');

const url = 'https://api.github.com/users/aperdomob';

const createMD5Hash = (input) => crypto.createHash('md5').update(input).digest('hex');

describe('Github GET api tests', () => {
  describe('Consume repo', () => {
    let reposUrl = '';
    let currentRepo;
    let readmeDownloadUrl = '';

    it('Check user name', async () => {
      const response = await agent.get(url).set('User-Agent', 'agent');
      expect(response.body.company).to.equal('Perficient Latam');
      expect(response.body.name).to.equal('Alejandro Perdomo');
      reposUrl = response.body.repos_url;
    });

    it('Search jasmine report', async () => {
      const res = await agent.get(reposUrl).set('User-Agent', 'agent');
      expect(res.body).to.be.an('array');
      const repo = res.body.find(
        (element) => element.name === 'jasmine-awesome-report'
      );
      expect(repo).not.equal(undefined);
      expect(repo.private).to.equal(false);
      expect(repo.description).to.equal('An awesome html report for Jasmine');
      currentRepo = repo;
    });

    it('Download Repo', async () => {
      const repoUrl = `${currentRepo.url}/zipball/master`;
      const res = await agent.get(repoUrl).set('User-Agent', 'agent');
      expect(res.status).to.equal(200);
      // Analyze md5
      expect(createMD5Hash(res.body)).to.equal(
        'df39e5cda0f48ae13a5c5fe432d2aefa'
      );
    });

    it('Analyze README', async () => {
      const readmeUrl = `${currentRepo.url}/contents/README.md`;
      const res = await agent.get(readmeUrl).set('User-Agent', 'agent');
      expect(res.status).to.equal(200);
      expect(res.body.sha).to.equal('1eb7c4c6f8746fcb3d8767eca780d4f6c393c484');
      expect(res.body.path).to.equal('README.md');
      expect(res.body.name).to.equal('README.md');
      readmeDownloadUrl = res.body.download_url;
    });

    it('Dowload and analyze README', async () => {
      const res = await agent.get(readmeDownloadUrl).set('User-Agent', 'agent');
      expect(res.status).to.equal(200);
      expect(createMD5Hash(res.text)).to.equal(
        '97ee7616a991aa6535f24053957596b1'
      );
    });
  });
});
