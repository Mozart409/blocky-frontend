# AGENTS.md - Blocky Frontend

Guidelines for AI coding agents working in this repository.

## Project Overview

A React frontend for [Blocky](https://github.com/0xERR0R/blocky), a DNS proxy and ad-blocker. Built with React 18, TypeScript, Vite, TanStack Query, and Tailwind CSS.

## Development Environment

**Required**: Use Nix flake for consistent environment.

```bash
nix develop              # Enter dev shell (Node 24, pnpm)
pnpm install             # Install dependencies
pnpm dev                 # Start dev server (auto-runs docker compose up -d)
```

## Build/Lint/Test Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server (runs `docker compose up -d` first) |
| `pnpm build` | TypeScript check + Vite production build |
| `pnpm start` | Preview production build |
| `pnpm api:generate` | Generate API client from OpenAPI spec (requires blocky running) |
| `pnpm up` / `pnpm down` | Start/stop Docker Compose services |
| `pnpm commit` | Commitizen for conventional commits |
| `pnpm change` | Create changeset for versioning |

**No test framework is configured.** The build command (`tsc && vite build`) serves as the primary validation.

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
  `keep-sorted` (`stage_fixed`), `just --fmt` (`stage_fixed`),
  `gitleaks git --staged` (secret scan), and `pnpm run build`
- **commit-msg**: `cog verify` (cocogitto) enforces Conventional Commits
- **pre-push**: `pnpm run image-amd` and `actionlint`

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

1. **ErrorBoundary** wraps the app in `main.tsx`:
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

Generated files in `src/api/`:
- `endpoints/` - React Query hooks by API tag (blocking, cache, lists, query)
- `schemas/` - TypeScript types from OpenAPI schemas

**Usage**:
```typescript
import { useBlockingStatus } from './api/endpoints/blocking/blocking'

const { data, isLoading } = useBlockingStatus()
// data.data.enabled, data.data.disabledGroups, etc.
```

### Legacy API (Deprecated)

Manual API functions exist in `src/utils/api.ts` - prefer generated client.

## Project Structure

```
src/
├── api/                  # Generated API client (Orval)
│   ├── endpoints/        # React Query hooks by tag
│   ├── schemas/          # Generated TypeScript types
│   └── mutator/          # Custom axios instance
├── components/           # React components
│   ├── BlockingStatus.tsx
│   ├── DNSQuery.tsx
│   ├── ErrorFallBack.tsx
│   ├── RefreshList.tsx
│   ├── Spacer.tsx
│   └── ThemeToggle.tsx
├── utils/                # Utilities (legacy API, types)
├── App.tsx               # Main app component
├── main.tsx              # Entry point with providers
└── index.css             # Global Tailwind styles
```

## Key Dependencies

- **React 18** with **TanStack React Query 5** for data fetching
- **Axios** as HTTP client (used by generated code)
- **Headless UI** for accessible components
- **react-hot-toast** for notifications
- **react-error-boundary** for error handling
- **usehooks-ts** for utility hooks (dark mode, etc.)

## Docker

```bash
pnpm image      # Build multi-arch image (arm/v7, arm64, amd64)
pnpm image-amd  # Build amd64-only image
```

Production uses Caddy as the web server (see `Caddyfile`).

## Conventions to Follow

1. **Always use `nix develop`** before running pnpm commands
2. **Regenerate API client** after OpenAPI spec changes
3. **Use conventional commits** via `pnpm commit`
4. **Prefer generated API hooks** over manual fetch calls
5. **Use FC type** for all functional components
6. **Handle loading/error states** explicitly in components
7. **Use toast notifications** for user-facing feedback
