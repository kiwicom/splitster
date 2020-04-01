## Release a new version

Once you'd like to release a new version to NPM, follow these steps:
1. Make sure you are on latest `master`
```bash
$ git checkout master
$ git pull origin master
```

2. Create a new branch
```bash
$ git checkout -b chore/release-0.0.56
```

3. Bump NPM version (there's no conventional-commit/semantic-release set up right now)
```bash
$ npm version patch
```

4. Push your branch to create a new PR on GitHub

*Note*: make sure the PR is targetting https://github.com/kiwicom/splitster and not the upstream repo.

```bash
$ git push origin chore/release-0.0.56
```

5. Wait for CI to pass and have your PR reviewed and merged.

6. Go to [Draft a new release](https://github.com/kiwicom/splitster/releases/new), and use:
  - `v0.0.56` as **Tag version**, with `master` as base (adapt the version accordingly)
  - `0.0.56` as **Release title**
and add a few notes about what changed since the last release.

Press **Publish release** and you should be done.

A GitHub workflow will take over from here and publish the version to NPM. You can inspect the [Node.js Package](https://github.com/kiwicom/splitster/actions?query=workflow%3A%22Node.js+Package%22) workflow page to check the status of the publishing.
