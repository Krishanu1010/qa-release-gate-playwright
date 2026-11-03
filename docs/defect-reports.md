# Sample defect reports

These are **training examples** of clear defect writing. They are not claims that these bugs exist in the demo application.

## Example A — Checkout accepts a blank email

- **Priority / severity:** P1 / High
- **Area:** Checkout validation
- **Environment:** Chromium, Windows 11, build `<commit SHA>`
- **Preconditions:** Add one in-stock item to the cart.
- **Steps:** Leave email blank; enter a valid name; select **Place order**.
- **Expected:** Checkout blocks submission and explains that a valid email is required.
- **Actual:** Order is created and a confirmation is displayed.
- **Impact:** The business cannot contact the customer and receives incomplete order data.
- **Evidence:** Attach trace, screenshot, request/response, and console output.
- **Retest / regression:** Repeat the blank-email case, then verify valid checkout and empty-cart handling.

## Example B — Price sort is not ascending

- **Priority / severity:** P2 / Medium
- **Area:** Catalog sorting
- **Environment:** Firefox, build `<commit SHA>`
- **Preconditions:** Catalog contains products at `$18.50`, `$24.00`, `$32.75`, and `$64.00`.
- **Steps:** Select **Price: low to high**.
- **Expected:** Products appear from `$18.50` through `$64.00`.
- **Actual:** `<record observed order>`.
- **Impact:** Customers may have difficulty comparing lower-priced items.
- **Evidence:** Screenshot plus captured `/api/products?sort=price-asc` response.
- **Retest / regression:** Verify UI order, API order, and default featured order.
