# AGENTS.md - Blocky Frontend

Guidelines for AI coding agents working in this repository.

## Project Overview

A React frontend for [Blocky](https://github.com/0xERR0R/blocky), a DNS proxy and ad-blocker. Built with React 19, TypeScript, Vite, TanStack Query, and Tailwind CSS.

## Development Environment

**Required**: Use Nix flake for consistent environment.

```bash
nix develop              # Enter dev shell (Node 24, pnpm)
pnpm install             # Install dependencies
just dev                 # Start compose stack (blocky) + Vite dev server
```

## Build/Lint/Test Commands

**Split of responsibilities:** `package.json` scripts run only Node tooling
(Vite, tsc, Orval). Everything that involves other tools (podman, cog,
biome, trivy, nix) is a recipe in the `justfile`. New tasks follow the same rule.

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start the Vite dev server only |
| `pnpm build` | TypeScript check + Vite production build |
| `pnpm start` | Preview production build |
| `pnpm api:generate` | Generate API client from OpenAPI spec (requires blocky running) |
| `just dev` | `just up`, then `pnpm dev` |
| `just up` / `just down` | Start/stop the podman-compose stack |
| `just check` | `biome check --write .` |
| `just image` / `just image-amd` | Build the multi-arch / amd64-only image with podman |
| `just trivy` | Build the image and scan it with trivy |
| `just bump` | cocogitto release (`cog bump --auto`): builds, bumps `package.json`, changelog + git tag, then **pushes** (see Commits & Releases) |
| `just update` / `just update-pnpm` | Update flake inputs (and commit) / interactively update pnpm deps |

**No test framework is configured.** The build command (`tsc && vite build`) serves as the primary validation.

## Testing Philosophy

- **Never write unit tests after writing code.** Unit tests written after the fact tend to re-describe the implementation rather than verify behavior.
- **Highly prefer E2E tests as the sole testing mechanism.** Use them to verify complex features end-to-end. At the end of an E2E test, produce a verifiable and repeatable artifact (e.g., a downloaded/verified file, a persisted DB row, or an API response fixture) rather than just asserting that a process exited cleanly.
- If a system must be tested in isolation, first write down all the ways it could fail, then write code to guard against those failure modes. Do not write the code first and backfill unit tests against it.
- When writing an E2E test, do not pick the simplest possible scenario to prove the happy path works. Pick a medium-to-hard scenario when verifying the work.

### Tooling comes from the Nix flake

All dev/CI tooling (Node, pnpm, Biome, gitleaks, lefthook, cocogitto,
keep-sorted, actionlint, trivy, podman) is provided by `flake.nix` — **not**
npm devDependencies. Always work inside `nix develop` (or direnv) so these
binaries are on `PATH`. The flake `shellHook` runs `lefthook install`.

| Tool | Command | Purpose |
|------|---------|---------|
| Biome | `biome check --write .` | Format + lint + import sorting (config: `biome.json`) |
| gitleaks | `gitleaks git --staged` | Secret scanning |
| keep-sorted | `keep-sorted <file>` | Sort marked blocks |
| cocogitto | `cog verify --file <msg>` | Conventional Commit validation |

> Biome ignores the Orval-generated `src/api/**` (see `biome.json` `files.includes`).

### Git Hooks (Lefthook)

- **pre-commit** (parallel): `biome check --write` (lint/format, `stage_fixed`),
  `keep-sorted` (`stage_fixed`), `just --fmt` (`stage_fixed`), and
  `gitleaks git --staged` (secret scan)
- **commit-msg**: `cog verify` (cocogitto) enforces Conventional Commits
- **pre-push**: `just image-amd`, `actionlint`, and `pnpm run build`

`keep-sorted` alphabetizes any block delimited by start/end marker comments.
Wrap a growing list (deps, ignore rules, plugin arrays) to keep it sorted:

```nix
buildInputs = with pkgs; [
  # keep-sorted start
  actionlint
  biome
  # keep-sorted end
];
```

## Commits & Releases

The commit type decides both the version bump and whether the commit appears
in `CHANGELOG.md`. The changelog is for people **deploying the image**, not for
maintainers. **`cog.toml` is the source of truth.** Before relying on the table
below, check `[commit_types]` in `cog.toml`, and update this table if they disagree.

| Type | Use for | Bump | In changelog |
|------|---------|------|--------------|
| `feat` | User-visible functionality in the UI/image | minor | yes |
| `fix` | User-visible bugs; `fix(security)` for CVE rebuilds | patch | yes |
| `docs` | README, compatibility notes | none | yes |
| `build` | Dockerfile, deps, toolchain pins | patch | no |
| `chore` | Tooling, flake, dev setup, API regen | none | no |
| `ci` | GitHub Actions workflows | none | no |
| `refactor` / `style` | Code changes with no behavior change | none | no |

Rules:
- **Tooling is never `feat` or `fix`.** Switching to podman/biome/cog,
  pnpm settings, or keep-sorted blocks are `chore`/`build`/`ci`.
  Misusing `feat`/`fix` pollutes the changelog and causes needless releases.
- **Security rebuilds use `fix(security): …`**, not `build`. Otherwise the
  release gets an empty changelog section.
- **Note blocky compatibility.** When the supported blocky version changes,
  say so in a user-visible commit, e.g. `feat(blocky): support blocky v0.35.0`.

`just bump` runs `pnpm build`, syncs `package.json`, commits, tags
`v{{version}}`, and **pushes the commit and tag**. Pushing the tag triggers the
Docker publish workflow. It only runs on `main`, and `cog check` only validates
commits since the latest tag (`from_latest_tag`).

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode enabled** - All strict checks are active
- **Target**: ESNext
- **No JavaScript allowed** (`allowJs: false`)
- **Path aliases defined** in tsconfig but rarely used in practice

### Import Organization

> Import sorting is enforced automatically by Biome (`assist.actions.source.organizeImports`).
> Run `biome check --write` — don't hand-order imports; the grouping below is illustrative.

Order imports as follows:
```typescript
// 1. React
import { FC, useState } from 'react'

// 2. Third-party libraries
import { useQuery, useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'

// 3. Local imports (components, utils, types)
import { useBlockingStatus } from '../api/endpoints/blocking/blocking'
import { ApiBlockingStatus } from '../api/schemas'

// 4. CSS (if any)
import './styles.css'
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `BlockingStatus.tsx`, `DNSQuery.tsx` |
| Component exports | Named export with FC type | `export const BlockingStatus: FC = () => {}` |
| Hooks | camelCase with `use` prefix | `useBlockingStatus`, `useDarkMode` |
| Utility files | camelCase | `api.ts`, `mutations.ts` |
| Types/Interfaces | PascalCase | `BlockStatusResponse`, `ApiQueryResult` |
| Variables | camelCase | `queryClient`, `blockingData` |
| Constants | UPPER_SNAKE_CASE | `BASEURL` |

### Component Structure

```typescript
import { FC, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

export const MyComponent: FC = () => {
  // 1. Hooks first
  const { data, isLoading, error } = useQuery(...)
  const [state, setState] = useState<string>('')

  // 2. Handlers
  const handleClick = () => { ... }

  // 3. Early returns for loading/error states
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  // 4. Main render
  return (
    <>
      <div className="...">
        {data && <span>{data.value}</span>}
      </div>
    </>
  )
}
```

### Error Handling

1. **ErrorBoundary** wraps the app in `App.tsx` (fallback: `components/ErrorFallBack.tsx`):
```typescript
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <App />
</ErrorBoundary>
```

2. **Toast notifications** for user feedback:
```typescript
try {
  await mutation.mutateAsync(data)
  toast.success('Operation successful')
} catch (error) {
  toast.error('Operation failed')
}
```

3. **React Query error states**:
```typescript
const { error } = useQuery(...)
if (error) return <div>Connection Error...</div>
```

### Styling

- **Tailwind CSS** - Use utility classes inline
- **No CSS modules or styled-components**
- Dark mode via `useDarkMode` hook from `usehooks-ts`

## API Client

### Generated Client (Preferred)

API client is auto-generated from OpenAPI spec using Orval:

```bash
pnpm api:generate  # Requires blocky running at localhost:4000
```

Without a running blocky, generate from the spec in blocky's repo
(`docs/api/openapi.yaml` at the release tag): `pnpm exec orval --input <file>`.

Generated files in `src/api/`:
- `endpoints/` - React Query hooks by API tag (blocking, cache, lists, query, stats)
- `schemas/` - TypeScript types from OpenAPI schemas

**Usage**:
```typescript
import { useBlockingStatus } from './api/endpoints/blocking/blocking'

const { data, isLoading } = useBlockingStatus()
// data.data.enabled, data.data.disabledGroups, etc.
```

## Project Structure

```
src/
├── api/                  # Generated API client (Orval)
│   ├── endpoints/        # React Query hooks by tag
│   ├── schemas/          # Generated TypeScript types
│   └── mutator/          # Custom axios instance
├── components/           # React components
│   ├── BlockingStatus.tsx
│   ├── CacheFlush.tsx
│   ├── DNSQuery.tsx
│   ├── ErrorFallBack.tsx
│   ├── RefreshList.tsx
│   ├── Spacer.tsx
│   ├── StatsDashboard.tsx
│   └── ThemeToggle.tsx
├── App.tsx               # Main app component + ErrorBoundary
├── main.tsx              # Entry point with providers
└── index.css             # Global Tailwind styles
```

## Key Dependencies

- **React 19** with **TanStack React Query 5** for data fetching
- **Axios** as HTTP client (used by generated code)
- **react-hot-toast** for notifications
- **react-error-boundary** for error handling
- **usehooks-ts** for utility hooks (dark mode, etc.)

## Docker

```bash
just image      # Build multi-arch image (arm64, amd64)
just image-amd  # Build amd64-only image
```

Production uses Caddy as the web server (see `Caddyfile`). The Dockerfile
rebuilds the caddy binary with a pinned Go toolchain and `golang.org/x/*`
versions (`caddy-builder` stage) so the image picks up Go security fixes
before upstream caddy does. Bump those pins when `just trivy` reports Go CVEs;
documented exceptions live in `.trivyignore`.

## Conventions to Follow

1. **Always use `nix develop`** before running pnpm or just commands
2. **Regenerate API client** after OpenAPI spec changes
3. **Use conventional commits** — plain `git commit`, validated on commit-msg by `cog verify`; pick the type per [Commits & Releases](#commits--releases) (check `cog.toml` first)
4. **Prefer generated API hooks** over manual fetch calls
5. **Use FC type** for all functional components
6. **Handle loading/error states** explicitly in components
7. **Use toast notifications** for user-facing feedback
