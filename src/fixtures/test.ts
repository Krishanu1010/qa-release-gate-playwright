import { test as base, expect } from '@playwright/test';
import { CatalogPage } from '../pages/catalog.page';

type FrameworkFixtures = {
  catalogPage: CatalogPage;
};

export const test = base.extend<FrameworkFixtures>({
  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },
});

export { expect };
