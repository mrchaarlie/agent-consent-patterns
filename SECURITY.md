# Security policy

## Supported versions

Security fixes are made for the latest published version of `@agentconsent/react` and the current
`main` branch of this repository. Versions that are no longer the latest release may not receive
backported fixes.

## Reporting a vulnerability

Please do **not** open a public GitHub issue for a suspected vulnerability. Report it privately by
emailing [contact@agentconsent.dev](mailto:contact@agentconsent.dev), or use GitHub's private
vulnerability reporting feature when it is available on this repository.

Include a clear description of the issue, affected versions or commits, reproduction steps, and
the potential impact. Do not include secrets or production credentials.

We aim to acknowledge reports within five business days. We will assess the report, coordinate a
fix and disclosure timeline with the reporter, and credit reporters when they want attribution.
Please give us reasonable time to investigate and remediate before any public disclosure.

## Release integrity

Public npm releases are intended to be built and published from GitHub Actions using npm Trusted
Publishing. Once enabled, npm provenance links each release to its source commit and build workflow.

## Maintainer setup

Before the first public release, enable GitHub private vulnerability reporting and subscribe the
maintainer to repository security alerts. Protect `main` with pull requests, required `CI` and
`Dependency review` checks, blocked force pushes, and blocked branch deletion.

After the first release creates the npm package, configure npm Trusted Publishing for
`.github/workflows/publish.yml`, require two-factor authentication, disallow token publishing, and
revoke any publish tokens that are no longer needed. These account settings cannot be enabled from
the repository itself.
