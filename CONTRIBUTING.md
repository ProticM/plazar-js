## PlazarJS Contributing Guide

Hello my fellow developer. Welcome to the PlazarJS contribution guide. I'm very proud of the fact that you are interested in contributing to PlazarJS. This means that we did a good job with the framework. Hopefully, with your help, it will grow and be even better. Please take a minute and read the following guide.

- [Issue Reporting](#issue-reporting)
- [Pull Request](#pull-request)
- [Branch Naming](#branch-naming)
- [Environment Setup](#environment-setup)
- [Build and Deploy](#build-and-deploy)
- [Project Structure](#project-structure)
- [Financial Contribution](#financial-contribution)

## Issue Reporting

- The issue is considered as valid only if it can be reproduced on the latest master.
- Open an issue on GitHub. The more information you provide, the easier it will be to validate and fix.

## Pull Request

- The `master` branch represents the latest production release. **Please do not push anything directly into this branch**.
- The `develop` branch represents the branch with the latest features.
- All development should be done in dedicated branches.
- Work under the `src` folder. Please do not push the `dist` folders. They are used to store the build files which are published when a release happens.
- Checkout a topic branch from the relevant branch and merge it back when finished.

#### Branch Naming

- If you are working on a feature:
    - Ideally, every new feature should be branched off of the `master` branch. I say ideally because over the years of developing I've learned that the new feature might depend on another feature which has'nt been deployed to production yet, but this is not that common.
    - Use prefix `feature` followed by a slash `/` followed by a description. Separate each word with a `-`, e.q. `feature/my-new-feature-description`
    - Merge the feature back against the `develop` branch when finished.

- If you are fixing a bug:
    - Checkout a hotfix branch from the relevant branch.
    - Use prefix `hotfix` followed by a slash `/` followed by a description. Separate each word with a `-`, e.q. `hotfix/my-hotfix-description`
    - Merge the hotfix back to the relevant branch when finished.

## Environment Setup

You need to install [Node.js](http://nodejs.org). Install the recommended version.

The next step would be to clone the repo and run the following command:

```bash
$ npm install
```

This will install the required packages found in `package.json` file.

Since the project is maintained by [lerna](https://github.com/lerna/lerna), you will need to bootstrap it:

```bash
$ lerna bootstrap
```

#### Build and Deploy

PlazarJS uses [gulp](http://gulpjs.com/) as its build tool. Run the following tasks to deploy the source into `dist`:

```
$ gulp build
```
If there was a change related to bootstrap-ui:
```
$ gulp build-bootstrap
```

## Project Structure

- [Demo](#demo)
- [Packages](#packages)
- [Scripts](#scripts)

#### Demo

This folder contains demo applications. Under the folder `bootstrap-ui` there is a demo showing how to use bootstrap components. Under the folder `bulma` there is a demo showing how to use PlazarJS without any ui components pre-defined. The [Bulma CSS Framework](https://bulma.io/) was used only to speed up the styling of the demo application. It is not a requirement.

#### Packages

This folder contains `core` and `bootstrap-ui` and they are distributed as separate NPM packages. Each time when you run any of the gulp tasks defined above, the build scripts will be created within the dist folder for each package. The version is managed by [lerna](https://github.com/lerna/lerna) by using the default `fixed` mode.

Each package has a `src` folder. This is your working area.

#### Scripts

This folder contains two JavaScript templates, `umd-wrapper.jst` and `dependant-module-wrapper.jst` which are used during building process to wrap the content of the output scripts.

## Financial Contribution

[Become a patron](https://www.patreon.com/mprotic) or [Donate via PayPal](https://www.paypal.me/mprotic).