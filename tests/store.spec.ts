import { expect, test } from '@playwright/test';

test.describe('Storefront release gate', () => {
  test('catalog renders products and clear availability states @smoke', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Field-tested essentials' })).toBeVisible();
    await expect(page.getByRole('article')).toHaveCount(4);
    await expect(page.getByRole('button', { name: 'Out of stock' })).toBeDisabled();
    await expect(page.getByText('$18.50')).toBeVisible();
  });

  test('sort control orders products by ascending price', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Sort').selectOption('price-asc');
    const cards = page.locator('[data-product]');
    await expect(cards.nth(0)).toContainText('Trailhead Mug');
    await expect(cards.nth(1)).toContainText('Steel Bottle');
    await expect(cards.nth(2)).toContainText('Camp Lantern');
    await expect(cards.nth(3)).toContainText('Daypack 18L');
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
