import type { Locator, Page } from '@playwright/test';

export class AccountPage {
  readonly heading: Locator;
  readonly welcomeMessage: Locator;
  readonly roleMessage: Locator;
  readonly signOutButton: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Account overview' });
    this.welcomeMessage = page.getByTestId('welcome-message');
    this.roleMessage = page.getByTestId('account-role');
    this.signOutButton = page.getByRole('button', { name: 'Sign out' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/account');
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async signOut(): Promise<void> {
    await this.signOutButton.click();
  }
}
