# Test strategy

## Objective

Provide a repeatable release confidence check for the demo storefront's main customer and staff paths: product discovery, cart updates, checkout validation, order creation, and access control.

## Scope

**In scope:** catalog data and availability, price sorting, cart count, empty-cart prevention, required customer fields, order API success/error behavior, invalid login, session persistence/logout, customer-versus-agent authorization, and Chromium/Firefox/WebKit browser execution.

**Out of scope:** real payment processing, durable account/order persistence, inventory reservation/concurrency, security penetration testing, load testing, and third-party integrations. Authentication coverage exercises only the demo's in-memory session behavior. The demo has no payment collection.

## Risk priorities

| Priority | Risk | Gate |
|---|---|---|
| P1 | Customer cannot find an available item or price/order is wrong | UI catalog and API contract checks |
| P1 | Invalid or empty cart can place an order | Checkout negative path and API validation |
| P1 | Valid customer cannot complete purchase | End-to-end order journey |
| P1 | Anonymous or customer account gains staff access | Authentication, session, and role authorization checks |
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
| Invalid login is rejected | `rejects invalid credentials without creating a session` |
| Session persists and logout revokes access | `persists a customer session across reloads and denies staff access` |
| Anonymous access is blocked and agent access is allowed | `protects session and staff APIs from anonymous requests`; `allows an agent to access staff reports` |
