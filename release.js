'use strict';

// @ts-check

const core = require('@actions/core');
const Octokit = require('@octokit/rest');

(async () => {
  const github = new Octokit({ auth: process.env.GITHUB_TOKEN });
  const tag = process.env.RELEASE_TAG;
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
  const releases = await github.repos.listReleases({ owner, repo });

  const release = releases.data.find(release => release.draft);
  if (release) {
    await github.repos.updateRelease({
      owner,
      repo,
      release_id: release.id,
      tag_name: tag,
      name: tag,
      draft: false,
    });
  } else {
    core.setFailed('No unpublished release found');
  }
})().catch(e => {
  core.setFailed(e.message);
});
