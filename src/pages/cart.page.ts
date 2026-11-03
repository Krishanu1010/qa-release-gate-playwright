import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly itemCount: Locator;

  constructor(page: Page) {
    this.itemCount = page.locator('#cart-count');
  }
}
