# Contributing

Thanks for your interest in Agent Consent Patterns.

## Getting started

Requirements: Node >= 20 (see `.node-version`), pnpm 11.9.0 (see `packageManager` in
`package.json`).

```sh
pnpm install
pnpm build      # build @agentconsent/react before running the site
pnpm dev        # run apps/site locally
```

Useful workspace commands:

```sh
pnpm -r test        # unit tests across all packages
pnpm -r typecheck
pnpm -r lint
```

`apps/site` imports `@agentconsent/react` from its built `dist/` output, so build the library
before typechecking, linting, or building the site.

## Making changes

- Open an issue or start a discussion before large changes, so we can agree on the approach.
- Keep pull requests focused on a single change.
- Add or update tests for behavior you change.
- Run `pnpm -r lint` and `pnpm -r typecheck` before opening a PR.
- Follow the existing code style in the file you're editing.

## Commit messages

Use a short, imperative summary line (e.g. `Add scoped grant demo`, `Fix focus trap in dialog`).

## Pull requests

CI runs build, typecheck, lint, and the unit and Playwright test suites, plus CodeQL and
dependency review. All required checks must pass before merge. PRs are merged into `main`.

## Releasing `@agentconsent/react`

Releases are cut by a maintainer: bump `version` in `packages/react/package.json`, add an entry to
[CHANGELOG.md](CHANGELOG.md), and tag the release. Publishing to npm happens from GitHub Actions
using Trusted Publishing with provenance — see [SECURITY.md](SECURITY.md) for details.

## Reporting security issues

Please do not open a public issue for a suspected vulnerability — see
[SECURITY.md](SECURITY.md) for how to report privately.

## Code of conduct

Be respectful and constructive. Assume good faith, and keep discussion focused on the work.
