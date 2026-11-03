import type { Locator, Page } from '@playwright/test';
import type { CustomerDetails } from '../data/store-data';

export class CheckoutPage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly placeOrderButton: Locator;
  readonly statusMessage: Locator;

  constructor(private readonly page: Page) {
    this.nameInput = page.getByLabel('Name');
    this.emailInput = page.getByLabel('Email');
    this.placeOrderButton = page.getByRole('button', { name: 'Place order' });
    this.statusMessage = page.getByRole('status');
  }

  async fillCustomerDetails(customer: CustomerDetails): Promise<void> {
    await this.nameInput.fill(customer.name);
    await this.emailInput.fill(customer.email);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }
}
