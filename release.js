'use strict';

// @ts-check

const core = require('@actions/core');
const Octokit = require('@octokit/rest');

(async () => {
  const github = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  const releases = await github.repos.listReleases({ owner, repo });

  const release = releases.data.find(release => release.draft);
  if (release) {
    console.log({ owner, repo });
    await github.repos.updateRelease({
      owner,
      repo,
      release_id: release.id,
      tag_name: Math.random().toString(36).slice(2)
    });
    console.log('updated release', release);
  } else {
    console.log('no unpublished release found');
  }

  core.setOutput('result', 'all good');
})().catch(e => {
  core.setFailed(e.message);
});
