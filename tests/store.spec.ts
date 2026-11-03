import { expect, test } from '../src/fixtures/test';
import { customers, demoProducts } from '../src/data/store-data';

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

  test('cart count updates and empty checkout is blocked @smoke', async ({ catalogPage, cartPage, checkoutPage }) => {
    await catalogPage.goto();
    await checkoutPage.placeOrder();
    await expect(checkoutPage.statusMessage).toHaveText('Your cart is empty.');
    await catalogPage.addProductToCart(demoProducts.mug.name);
    await expect(cartPage.itemCount).toHaveText('1');
  });

  test('checkout validates required customer fields', async ({ catalogPage, checkoutPage }) => {
    await catalogPage.goto();
    await catalogPage.addProductToCart(demoProducts.mug.name);
    await checkoutPage.placeOrder();
    await expect(checkoutPage.statusMessage).toHaveText('Enter your name and email to continue.');
  });

  test('customer can complete an order and cart resets', async ({ catalogPage, cartPage, checkoutPage }) => {
    await catalogPage.goto();
    await catalogPage.addProductToCart(demoProducts.daypack.name);
    await checkoutPage.fillCustomerDetails(customers.validCheckout);
    await checkoutPage.placeOrder();
    await expect(checkoutPage.statusMessage).toContainText('Order QA-');
    await expect(cartPage.itemCount).toHaveText('0');
  });
});
