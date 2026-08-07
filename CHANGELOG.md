# Changelog

All notable changes to `@agentconsent/react` and this repository are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2026-08-07

### Added

- Package README for `@agentconsent/react`, so the npm package page documents the library
  (it previously showed no readme).
- Agent skill: core principles 11 ("The acting agent must be identifiable") and 12 ("The user can
  always interrupt"), which the site documented but the skill omitted.

### Changed

- Landing page, site metadata, OG image, and README now lead with a plain-language description of
  the project instead of the jargon-heavy tagline.
- Agent plugin bumped to 0.1.2 in the `.claude-plugin` and `.codex-plugin` manifests, for the two
  added principles.
- Home hero mock: the "can't be undone" warning is now a tinted banner with an icon badge, and
  the dialog centers when it stacks below the intro text on narrow screens.
- Home footer now recommends Action Preview without claiming the other patterns build on it.

### Fixed

- Plugin manifests and the generated `llms.txt` claimed 10 principles; there are 12.
- README and library guide examples used a nonexistent `ActionPreview.Button` and omitted the
  required `Root` handlers (#42).

## [0.1.1] - 2026-07-15

### Added

- npm publish provenance via GitHub Actions Trusted Publishing.

## [0.1.0] - 2026-07-12

### Added

- Initial public release: headless React component library and reference site for AI agent
  consent UX patterns.

[Unreleased]: https://github.com/mrchaarlie/agent-consent-patterns/compare/react-v0.1.2...HEAD
[0.1.2]: https://github.com/mrchaarlie/agent-consent-patterns/compare/react-v0.1.1...react-v0.1.2
[0.1.1]: https://github.com/mrchaarlie/agent-consent-patterns/releases/tag/react-v0.1.1
[0.1.0]: https://github.com/mrchaarlie/agent-consent-patterns/compare/2458e06...6d2c79a
