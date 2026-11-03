import { expect, test } from '../src/fixtures/test';

test.describe('Storefront release gate', () => {
  test('catalog renders products and clear availability states @smoke', async ({ catalogPage }) => {
    await catalogPage.goto();
    await expect(catalogPage.heading).toBeVisible();
    await expect(catalogPage.productCards).toHaveCount(4);
    await expect(catalogPage.unavailableButton).toBeDisabled();
    await expect(catalogPage.productCard('Trailhead Mug')).toContainText('$18.50');
  });

  test('sort control orders products by ascending price', async ({ catalogPage }) => {
    await catalogPage.goto();
    await catalogPage.sortBy('price-asc');
    await expect(catalogPage.productCardAt(0)).toContainText('Trailhead Mug');
    await expect(catalogPage.productCardAt(1)).toContainText('Steel Bottle');
    await expect(catalogPage.productCardAt(2)).toContainText('Camp Lantern');
    await expect(catalogPage.productCardAt(3)).toContainText('Daypack 18L');
  });

  test('cart count updates and empty checkout is blocked @smoke', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByRole('status')).toHaveText('Your cart is empty.');
    await page.locator('[data-id="MUG-01"]').click();
    await expect(page.locator('#cart-count')).toHaveText('1');
  });

  test('checkout validates required customer fields', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-id="MUG-01"]').click();
    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByRole('status')).toHaveText('Enter your name and email to continue.');
  });

  test('customer can complete an order and cart resets', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-id="BAG-02"]').click();
    await page.getByLabel('Name').fill('Casey Tester');
    await page.getByLabel('Email').fill('casey@example.com');
    await page.getByRole('button', { name: 'Place order' }).click();
    await expect(page.getByRole('status')).toContainText('Order QA-');
    await expect(page.locator('#cart-count')).toHaveText('0');
  });
});
