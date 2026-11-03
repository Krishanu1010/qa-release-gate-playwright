import { test as base, expect } from '@playwright/test';
import { StoreApiClient } from '../api/store-api.client';
import { AccountPage } from '../pages/account.page';
import { CartPage } from '../pages/cart.page';
import { CatalogPage } from '../pages/catalog.page';
import { CheckoutPage } from '../pages/checkout.page';
import { LoginPage } from '../pages/login.page';
import { authTestUsers } from '../data/auth-test-users';

export type FrameworkFixtures = {
  cartPage: CartPage;
  catalogPage: CatalogPage;
  checkoutPage: CheckoutPage;
  accountPage: AccountPage;
  loginPage: LoginPage;
  storeApi: StoreApiClient;
  authUsers: typeof authTestUsers;
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
  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  storeApi: async ({ request }, use) => {
    await use(new StoreApiClient(request));
  },
  authUsers: [authTestUsers, { option: true }],
});

export { expect };
