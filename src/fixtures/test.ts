import { test as base, expect } from '@playwright/test';
import { StoreApiClient } from '../api/store-api.client';
import { CartPage } from '../pages/cart.page';
import { CatalogPage } from '../pages/catalog.page';
import { CheckoutPage } from '../pages/checkout.page';

type FrameworkFixtures = {
  cartPage: CartPage;
  catalogPage: CatalogPage;
  checkoutPage: CheckoutPage;
  storeApi: StoreApiClient;
};

export const test = base.extend<FrameworkFixtures>({
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  storeApi: async ({ request }, use) => {
    await use(new StoreApiClient(request));
  },
});

export { expect };
