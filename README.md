# QA Release Gate | Playwright UI + API portfolio

A recruiter-friendly QA engineering project showing how I plan and automate a small release gate for a demo storefront. It combines browser workflows, API contract checks, negative cases, documented coverage, and CI artifacts in one runnable repository.

> The storefront is a deliberately small local demo app created for this portfolio. Its behavior and test results are illustrative and are not claims about production work or client systems.

## What this demonstrates

- **Functional testing:** catalog, stock state, sorting, cart, checkout validation, and successful order flow.
- **Automation design:** Playwright Test with isolated, readable tests and semantic locators.
- **API testing:** product contract, sort behavior, order validation, and successful order creation.
- **Release readiness:** smoke tags, three-browser execution, retry policy in CI, and failure traces/screenshots/video.
- **Test planning:** scope, risk priorities, traceability, and sample defect reports in `docs/`.

## Quick start

Requirements: Node.js 20 or newer.

```bash
pnpm install
pnpm exec playwright install --with-deps
pnpm test
```

The Playwright config starts the demo app automatically on `http://127.0.0.1:4173`. The HTML report is generated at `playwright-report/`.

On Windows, if `--with-deps` is not supported, run `npx playwright install` instead.

Run focused checks:

```bash
pnpm test:ui       # Chromium browser checks
pnpm test:api      # API checks
pnpm test:smoke    # Critical tagged journeys
pnpm report        # Open the last HTML report
```

Set `BASE_URL` to point the suite at a separately hosted compatible demo app. API tests use Playwright's request fixture and the same configured base URL.

## Coverage map

| Area | Scenario | Priority | Layer |
|---|---|---:|---|
| Catalog | Products, prices, availability | P1 | UI + API |
| Sorting | Ascending price order | P1 | UI + API |
| Cart | Count updates; empty cart blocks checkout | P1 | UI |
| Checkout | Required name/email validation | P1 | UI |
| Orders | Valid order creates confirmation and resets cart | P1 | UI + API |
| Orders | Missing items/email returns a client error | P1 | API |

More detailed assumptions, risks, and sample defects live in [`docs/test-strategy.md`](docs/test-strategy.md) and [`docs/defect-reports.md`](docs/defect-reports.md).

## CI

GitHub Actions runs the suite on pushes and pull requests, installs Playwright browsers, and uploads the HTML report and failure artifacts. See `.github/workflows/quality-gate.yml`.

## Repository layout

```text
demo/                   Self-contained demo storefront and API
tests/store.spec.ts     Browser functional and smoke coverage
tests/api/              API contract and validation coverage
docs/                   Test strategy, traceability, sample defects
.github/workflows/      Continuous integration release gate
```

## Example portfolio summary

> Built a Playwright and TypeScript QA release gate for a demo commerce workflow, covering critical browser journeys and API validation. Added cross-browser CI execution, risk-based test documentation, and failure artifacts to make regressions easier to diagnose.

This wording describes this repository only. Keep resume metrics tied to results you can substantiate from your own work.
