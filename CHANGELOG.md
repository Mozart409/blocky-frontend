# Changelog

All notable changes to this project will be documented in this file. See [conventional commits](https://www.conventionalcommits.org/) for commit guidelines.

- - -
## [v1.3.0](https://github.com/Mozart409/blocky-frontend/compare/v1.2.2...v1.3.0) - 2026-07-03
#### Features
- (**biome**) setup biome - ([e12ffeb](https://github.com/Mozart409/blocky-frontend/commit/e12ffebe49d3ea5005dbfbbb29d233b03b62970f)) - [@Mozart409](https://github.com/Mozart409)
- (**blocky**) add stats and a denylist - ([b45ebf7](https://github.com/Mozart409/blocky-frontend/commit/b45ebf73ec20e29f5c2dc0d8c4d3dbb20a8ff618)) - [@Mozart409](https://github.com/Mozart409)
- (**frontend**) add timed disable, statistics, and more actions - ([0fd0279](https://github.com/Mozart409/blocky-frontend/commit/0fd0279418e27554576ac9223233fc723706f92d)) - [@Mozart409](https://github.com/Mozart409)
- (**tools**) add more keep-sorted stuff - ([1936388](https://github.com/Mozart409/blocky-frontend/commit/1936388981169deaf18293cc8db1f78fb3a63d40)) - [@Mozart409](https://github.com/Mozart409)
#### Bug Fixes
- (**changeset**) remove changeset - ([0204b7d](https://github.com/Mozart409/blocky-frontend/commit/0204b7d5345176c1f9d1feca06a536754ea92437)) - [@Mozart409](https://github.com/Mozart409)
- (**dockerfile**) added .npmrc to dockerfile - ([9785461](https://github.com/Mozart409/blocky-frontend/commit/97854617566d256853e2c3a3d46f49e1c65ee25c)) - [@Mozart409](https://github.com/Mozart409)
- (**flake**) convert to podman - ([2b25348](https://github.com/Mozart409/blocky-frontend/commit/2b253488838f09cbb2ae728a5e55742a68241f8b)) - [@Mozart409](https://github.com/Mozart409)
- (**pnpm**) migrate to new settings - ([cedc5f7](https://github.com/Mozart409/blocky-frontend/commit/cedc5f727e6defef60a1821d56c75c5b62d623d7)) - [@Mozart409](https://github.com/Mozart409)
- (**release**) ignore merge commits and add changelog marker - ([82c12fc](https://github.com/Mozart409/blocky-frontend/commit/82c12fc2ebc82776f10590138e10c00da08187ad)) - [@Mozart409](https://github.com/Mozart409)
- (**security**) update caddy image to fix cves - ([2223645](https://github.com/Mozart409/blocky-frontend/commit/22236458116674e2613804c122a962284a7fc63f)) - [@Mozart409](https://github.com/Mozart409)
- (**tools**) remove lefthook from npm - ([6e613e6](https://github.com/Mozart409/blocky-frontend/commit/6e613e6de9129850701974a2b136ef6849d1f926)) - [@Mozart409](https://github.com/Mozart409)
- (**tools**) switch to podman-compose - ([c1639ff](https://github.com/Mozart409/blocky-frontend/commit/c1639ff8fbe5a1438f84dd4bdc64266995bbd33c)) - [@Mozart409](https://github.com/Mozart409)
- (**tools**) switch to podman - ([746d5bb](https://github.com/Mozart409/blocky-frontend/commit/746d5bb0f47ffabd38294fd9de2807f3334819c7)) - [@Mozart409](https://github.com/Mozart409)
#### Documentation
- (**readme**) add compat line - ([80ac7d8](https://github.com/Mozart409/blocky-frontend/commit/80ac7d8e225a8a8e0812559a06f7649e9daa3c1f)) - [@Mozart409](https://github.com/Mozart409)
- (**readme**) :memo: update readme and new screenshots - ([72219f8](https://github.com/Mozart409/blocky-frontend/commit/72219f8158cdea5e310991ac794d34d3b65e2667)) - [@Mozart409](https://github.com/Mozart409)

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
