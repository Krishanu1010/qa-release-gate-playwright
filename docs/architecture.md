# Framework architecture

## Purpose

This repository demonstrates a maintainable Playwright + TypeScript quality gate against a deterministic demo storefront. The storefront is a training target, not a production or client system. The test framework is organized around test intent and reusable boundaries; it avoids generic abstractions that do not yet have multiple consumers.

## System view

```mermaid
flowchart TD
  CLI[Local commands] --> Config[Validated environment config]
  CI[GitHub Actions] --> Config
  Config --> Runner[Playwright Test projects]
  Runner --> Fixtures[Fixtures]
  Fixtures --> Data[Synthetic test data]
  Fixtures --> Pages[Page objects]
  Fixtures --> Clients[API clients]
  Pages --> Web[Demo storefront]
  Clients --> API[Demo API]
  Runner --> Reports[HTML report and failure artifacts]
  Reports --> Actions[GitHub Actions artifacts]
```

## Component responsibilities

| Component | Responsibility | Keep out |
|---|---|---|
| `config/environment.ts` | Select local, CI, or staging target; validate `BASE_URL` before startup | Credentials and test behavior |
| `playwright.config.ts` | Runner defaults, projects, retries, artifacts, and local demo server lifecycle | Business assertions |
| `tests/` | Scenario intent and meaningful expected outcomes | Low-level duplicated page selectors |
| `src/fixtures/test.ts` | Provide focused catalog, cart, and checkout page fixtures; re-export Playwright's `expect` | Unrelated global mutable state |
| `src/pages/` | Page-specific locators and user actions for catalog, cart summary, and checkout | Assertions that belong to scenario intent |
| `src/data/store-data.ts` | Synthetic product identifiers and customer details shared by scenarios | Passwords, tokens, or production records |
| `src/api/` *(next milestone)* | Typed endpoint calls and response validation | UI navigation |
| `src/data/` *(next milestone)* | Synthetic, non-secret deterministic test cases | Passwords, tokens, or production records |

## Environment selection

- `local` is the default and starts the demo app on `127.0.0.1:4173`.
- `ci` is selected automatically by GitHub Actions and starts the same demo app in the runner.
- `staging` requires an explicit `BASE_URL` and does not start the local demo app.
- `.env.example` documents local overrides. Copy it to `.env`; `.env` is ignored by Git.
- Secrets are supplied through the shell or GitHub Actions secrets when a later milestone needs authentication. No credentials belong in source files or stored browser state committed to Git.

## Test design rules

1. Each test owns its business outcome assertions.
2. Page objects expose meaningful actions and state, not generic wrappers around every Playwright method.
3. Use API calls for setup only when they preserve the scenario's intent; verify the behavior under test through its actual interface.
4. Keep tests independent and repeatable; avoid test-order dependencies and fixed sleeps.
5. Treat retries as diagnostic signal. A test that passes only after retry is flaky and remains visible in reports.
6. Add an abstraction only when it removes real duplication or provides a clear domain boundary.

## Evolution plan

The current code includes focused catalog, cart, and checkout page objects with typed fixtures. UI scenarios use synthetic centralized data while assertions remain in the tests. Follow-up milestones will introduce typed API clients and authentication state, then Allure and CI evidence. Docker remains optional until it solves an observed environment-parity problem.
