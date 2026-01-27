# blocky-frontend

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
