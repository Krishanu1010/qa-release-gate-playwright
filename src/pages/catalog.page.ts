import type { Locator, Page } from '@playwright/test';

export type CatalogSortOrder = 'featured' | 'price-asc';

export class CatalogPage {
  readonly heading: Locator;
  readonly productCards: Locator;
  readonly unavailableButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Field-tested essentials' });
    this.productCards = page.getByRole('article');
    this.unavailableButton = page.getByRole('button', { name: 'Out of stock' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async sortBy(order: CatalogSortOrder): Promise<void> {
    await this.page.getByLabel('Sort').selectOption(order);
  }

  productCardAt(position: number): Locator {
    return this.productCards.nth(position);
  }

  productCard(productName: string): Locator {
    return this.productCards.filter({
      has: this.page.getByRole('heading', { name: productName, exact: true }),
    });
  }
}
