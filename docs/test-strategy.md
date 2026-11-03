# Test strategy

## Objective

Provide a repeatable release confidence check for the demo storefront's most important customer paths: product discovery, cart updates, checkout validation, and order creation.

## Scope

**In scope:** catalog data and availability, price sorting, cart count, empty-cart prevention, required customer fields, order API success/error behavior, and Chromium/Firefox/WebKit browser execution.

**Out of scope:** real payment processing, authentication, persistence across sessions, inventory reservation/concurrency, security penetration testing, load testing, and third-party integrations. The demo has no payment collection.

## Risk priorities

| Priority | Risk | Gate |
|---|---|---|
| P1 | Customer cannot find an available item or price/order is wrong | UI catalog and API contract checks |
| P1 | Invalid or empty cart can place an order | Checkout negative path and API validation |
| P1 | Valid customer cannot complete purchase | End-to-end order journey |
| P2 | Sorting makes the catalog harder to use | UI and API ordering assertions |
| P2 | Browser-specific regression | Chromium, Firefox, and WebKit projects |

## Test data and isolation

Catalog fixtures are deterministic and read-only. Each order request is independent; the demo does not persist orders. Browser tests start from a fresh page and do not rely on test execution order. No real personal or payment data is used.

## Entry and exit criteria

**Entry:** app health endpoint responds and dependencies/browsers are installed.

**Exit:** all P1 checks pass in CI; any failure has a trace/screenshot/video artifact; known defects are documented with reproducible evidence and disposition.

## Defect workflow

Record environment, build/commit, preconditions, reproducible steps, expected and actual behavior, severity/priority, and evidence. Retest the fix, then run impacted regression areas. Sample reports are illustrative examples, not defects discovered in an external product.

## Traceability

| Requirement | Coverage |
|---|---|
| Catalog lists products and communicates unavailable stock | `catalog renders products and clear availability states` |
| User can order products by price | `sort control orders products by ascending price`; API `honors ascending price sort` |
| Empty cart cannot be checked out | `cart count updates and empty checkout is blocked` |
| Required customer details are enforced | `checkout validates required customer fields`; API `rejects an order without items or email` |
| Valid order returns confirmation | `customer can complete an order and cart resets`; API `creates an order with required customer data` |
