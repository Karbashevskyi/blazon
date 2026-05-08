# Contributing to Blazon

Thank you for your interest in contributing! Blazon is an open-source heraldry registry and we welcome all kinds of contributions: new coat of arms entries, bug fixes, documentation improvements, new framework adapters, and more.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Adding a Coat of Arms](#adding-a-coat-of-arms)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Releases & Versioning](#releases--versioning)

---

## Code of Conduct

This project follows the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Be respectful, inclusive, and constructive in all interactions.

---

## Ways to Contribute

| Contribution type | Where to start |
|-------------------|----------------|
| Add a coat of arms | [Adding a Coat of Arms](#adding-a-coat-of-arms) |
| Report a bug | [Open an issue](https://github.com/blazon-registry/blazon/issues) with the `bug` label |
| Request a feature | [Open an issue](https://github.com/blazon-registry/blazon/issues) with the `enhancement` label |
| Fix a bug | Find an issue labelled `good first issue` or `help wanted` |
| Improve docs | Edit `README.md`, `CONTRIBUTING.md`, or files in `apps/docs/` |
| Add a framework adapter | Discuss in an issue first — adapters must follow the architecture rules |
| Improve the generator | Work in `tools/generator/` |

---

## Development Setup

### Prerequisites

- **Node.js** ≥ 20 (use [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm))
- **pnpm** ≥ 9 — `npm install -g pnpm`
- **Git**

### Steps

```bash
# 1. Fork the repo, then clone your fork
git clone https://github.com/<your-username>/blazon.git
cd blazon

# 2. Install dependencies
pnpm install

# 3. Build all packages (required before first typecheck/lint)
pnpm build

# 4. Run typechecks
pnpm typecheck

# 5. Run linter
pnpm lint
```

### Useful scripts

```bash
pnpm build              # Build all packages (respects turbo cache)
pnpm dev                # Start all dev watchers
pnpm typecheck          # TypeScript across the workspace
pnpm lint               # ESLint across the workspace
pnpm lint:fix           # Auto-fix ESLint issues
pnpm format             # Prettier format everything
pnpm format:check       # Check formatting without writing
pnpm test               # Run all test suites
pnpm clean              # Remove all dist/ and node_modules/
```

---

## Project Structure

```
blazon/
├── packages/
│   ├── types/          Pure TypeScript types — zero runtime code, zero deps
│   ├── core/           Framework-agnostic registry, search, validation, loading
│   └── ngx/            Angular 19+ standalone adapter
├── apps/
│   └── docs/           Interactive documentation (Vite + vanilla TS)
├── tools/
│   └── generator/      CLI: SVG + meta.json → registry entry JSON
└── assets/
    └── {cc}/           Assets organised by country code
        └── {level}/    Then by administrative level
            └── {slug}/ One folder per entity
```

### Dependency flow

```
@blazon/types  ←  no external deps
      ↑
@blazon/core   ←  @blazon/types only
      ↑
@blazon/ngx    ←  @blazon/core + Angular peer deps
```

**Critical rule:** Adapters must not contain business logic. All logic lives in `@blazon/core`.

---

## Adding a Coat of Arms

### 1. Create the asset folder

```
assets/{cc}/{level}/{slug}/
```

- `{cc}` — ISO 3166-1 alpha-2 country code, lowercase (`pl`, `de`, `gb`)
- `{level}` — one of: `national`, `state`, `county`, `city`, `district`, `village`
- `{slug}` — URL-safe name of the entity, lowercase, hyphens only (`warszawa`, `west-yorkshire`)

**Example:** `assets/pl/city/krakow/`

### 2. Add the SVG

Create `{slug}.svg` in the folder. Guidelines:

- Use `viewBox` — no hardcoded `width`/`height` on the root element
- Include `<title>` and optionally `<desc>` for accessibility
- Add `role="img"` to the root `<svg>`
- Remove inline `style` attributes — use SVG presentation attributes
- Keep file size reasonable (strip unnecessary metadata)
- Do not reference external resources (no `<image href="...">` with remote URLs)

### 3. Add the sidecar metadata

Create `{slug}.meta.json` alongside the SVG:

```json
{
  "name": "Herb Krakowa",
  "countryCode": "PL",
  "type": "municipal",
  "level": "city",
  "region": "Lesser Poland Voivodeship",
  "city": "Kraków",
  "description": "Coat of arms of Kraków, the former royal capital of Poland.",
  "blazon": "Gules, a city gate argent...",
  "license": {
    "spdx": "CC0-1.0",
    "name": "Creative Commons Zero v1.0 Universal",
    "url": "https://creativecommons.org/publicdomain/zero/1.0/",
    "source": "https://commons.wikimedia.org/wiki/..."
  },
  "tags": ["poland", "krakow", "city", "royal", "historic"]
}
```

### 4. Generate the registry entry

```bash
pnpm exec tsx tools/generator/bin/generate.ts --write assets/pl/city/krakow
```

This creates `index.json` in the folder. Do not edit `index.json` manually.

### 5. Verify

```bash
# Check the generated entry
cat assets/pl/city/krakow/index.json

# Run typechecks
pnpm typecheck
```

### 6. Open a pull request

Include:
- The `.svg` file
- The `.meta.json` sidecar
- The generated `index.json`
- A brief description of the source and license

---

## Coding Standards

### TypeScript

- **Strict mode** is enforced. All code must typecheck with `strict: true`.
- Use `type` imports for type-only imports: `import type { Foo } from './foo.js'`
- Explicit return types on exported functions
- No `any` — use `unknown` at system boundaries and narrow safely
- Readonly properties on all interface fields where mutation is not intended

### ESLint + Prettier

- ESLint runs with `typescript-eslint/strict-type-checked` rules
- Prettier enforces formatting (single quotes, trailing commas, 100-char width)
- Run `pnpm lint:fix && pnpm format` before committing

### Architecture constraints

| Rule | Rationale |
|------|-----------|
| No business logic in adapters | Keeps `core` testable and framework-portable |
| No DOM API in `@blazon/core` | Core must run in Node.js and browsers equally |
| All validation at system boundaries | Don't validate already-validated domain objects |
| Named exports only (no default exports) | Supports tree-shaking and consistent imports |

### Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(core): add preload() method to BlazonRegistry
fix(ngx): resolve change detection issue on id input change
feat(assets): add coat of arms for Kraków (pl-city-krakow)
docs: update generator CLI usage examples
chore: upgrade Angular peer dep to ^20.0.0
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `build`

---

## Pull Request Process

1. **Branch** from `main`: `git checkout -b feat/my-contribution`
2. Make your changes following the coding standards above
3. Ensure CI passes: `pnpm build && pnpm typecheck && pnpm lint`
4. Write a clear PR description:
   - What problem does it solve?
   - What approach did you take?
   - Breaking changes (if any)?
5. For new packages or significant API changes, add a changeset:
   ```bash
   pnpm changeset
   ```
6. Request a review — maintainers typically respond within a few days

---

## Releases & Versioning

Blazon uses [Changesets](https://github.com/changesets/changesets) for version management.

- Every PR that changes a published package must include a changeset
- Changesets describe the impact (`patch` / `minor` / `major`) and what changed
- Releases are automated via GitHub Actions on merge to `main`

### Semver policy

| Change type | Version bump |
|-------------|-------------|
| Bug fix, documentation | `patch` |
| New feature, new export | `minor` |
| Breaking API change | `major` |
| New asset only | No package version bump needed |

---

## Questions?

Open a [GitHub Discussion](https://github.com/blazon-registry/blazon/discussions) or file an [issue](https://github.com/blazon-registry/blazon/issues). We're friendly!
