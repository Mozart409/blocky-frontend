# Changelog

All notable changes to this project will be documented in this file. See [conventional commits](https://www.conventionalcommits.org/) for commit guidelines.

- - -
## v1.3.0 - 2026-07-03
#### Features
- (**biome**) setup biome - (e12ffeb) - Amadeus Mader
- (**blocky**) add stats and a denylist - (b45ebf7) - Amadeus Mader
- (**frontend**) add timed disable, statistics, and more actions - (0fd0279) - Amadeus Mader
- (**tools**) add more keep-sorted stuff - (1936388) - Amadeus Mader
#### Bug Fixes
- (**changeset**) remove changeset - (0204b7d) - Amadeus Mader
- (**dockerfile**) added .npmrc to dockerfile - (9785461) - Amadeus Mader
- (**flake**) convert to podman - (2b25348) - Amadeus Mader
- (**pnpm**) migrate to new settings - (cedc5f7) - Amadeus Mader
- (**release**) ignore merge commits and add changelog marker - (82c12fc) - Amadeus Mader
- (**security**) update caddy image to fix cves - (2223645) - Amadeus Mader
- (**tools**) remove lefthook from npm - (6e613e6) - Amadeus Mader
- (**tools**) switch to podman-compose - (c1639ff) - Amadeus Mader
- (**tools**) switch to podman - (746d5bb) - Amadeus Mader
#### Documentation
- (**readme**) add compat line - (80ac7d8) - Amadeus Mader
- (**readme**) :memo: update readme and new screenshots - (72219f8) - Amadeus Mader
#### Build system
- (**deps**) bump @tanstack/react-query from 5.100.6 to 5.101.2 (#233) - (55db664) - dependabot[bot]
- (**deps**) bump react-error-boundary from 6.1.1 to 6.1.2 (#235) - (cb2d608) - dependabot[bot]
- (**deps**) bump axios from 1.16.0 to 1.18.1 (#232) - (f7490ac) - dependabot[bot]
- (**deps**) bump actions/checkout from 6 to 7 (#239) - (6d6ba1e) - dependabot[bot]
- (**deps**) bump fast-uri in the npm_and_yarn group across 1 directory (#229) - (b894953) - dependabot[bot], *dependabot[bot]*
- (**deps-dev**) bump @vitejs/plugin-react from 6.0.1 to 6.0.3 (#234) - (7da7e75) - dependabot[bot]
- (**deps-dev**) bump tailwindcss from 4.2.4 to 4.3.2 (#230) - (db10e96) - dependabot[bot]
- (**deps-dev**) bump @types/node from 25.6.0 to 26.1.0 (#237) - (60b1209) - dependabot[bot]
- (**deps-dev**) bump @tailwindcss/vite from 4.2.4 to 4.3.2 (#236) - (9888a24) - dependabot[bot]
- (**deps-dev**) bump postcss from 8.5.12 to 8.5.16 (#231) - (e00a27c) - dependabot[bot]
- (**deps-dev**) bump vite from 8.0.10 to 8.0.16 (#238) - (5fe0a23) - dependabot[bot]
#### Refactoring
- (**ci**) move to nix tools - (d98ed60) - Amadeus Mader
- (**cog**) switch to cog - (7241b7a) - Amadeus Mader
- (**tools**) use cog bump - (43b9aa9) - Amadeus Mader
#### Miscellaneous Chores
- (**biome**) fix fmt - (4fb70b8) - Amadeus Mader
- (**deps**) upgrade pkgs - (2f5433f) - Amadeus Mader
- (**deps**) upgrade blocky and change ports - (e221a22) - Amadeus Mader
- (**deps**) upgrade flake - (7de50e7) - Amadeus Mader
- (**openapi**) update schema to new blocky version - (1ab4689) - Amadeus Mader

- - -


## 1.2.2

### Patch Changes

- Upgrade dependencies

## 1.2.1

### Patch Changes

- Upgrade pkgs

## 1.2.0

### Minor Changes

- Fix all possible cves

## 1.1.2

### Patch Changes

- More security fixes

## 1.1.1

### Patch Changes

- Update build matrix

## 1.1.0

### Minor Changes

- f8db2ac: Security patches etc

## 1.0.0

### Major Changes

- Modernize to React 19 and latest ecosystem

  BREAKING CHANGES:

  - Upgrade React 18.3 → 19.2 with new JSX transform
  - Migrate react-query v3 → @tanstack/react-query v5 with new API
  - Replace devenv with Nix flakes (new development setup)
  - Migrate to Orval-generated API client (removes manual API utilities)
  - Upgrade Vite 5 → 7 and Tailwind 3 → 4 with new configuration
  - Replace redaxios with axios HTTP client

  New Features:

  - Auto-generated TypeScript API client from OpenAPI spec
  - Comprehensive development guidelines in AGENTS.md
  - Optimized Docker build process with health checks
  - Modern development tooling with justfile automation

### Minor Changes

- 7430b95: upgrade deps and added arm64 and armv7

## 0.2.1

### Patch Changes

- added lefthook

## 0.2.0

### Minor Changes

- Upgrade dependencies and responsive styling

## 0.1.1

### Patch Changes

- bafe9be: improved bundlesize from 450kb to 280kb
  changed caddy port from 80 to 8002

## 0.1.0

### Minor Changes

- bumped the dependency versions
- added more types
- fix issue #35 API_URL in production

## 0.0.4

### Patch Changes

- 7a14893: if in production mode set the API_URL via .env
- 6d59d02: added changesets
  upgraded dependencies
