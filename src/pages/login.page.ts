import type { Locator, Page } from '@playwright/test';
import type { AuthTestUser } from '../data/auth-test-users';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly statusMessage: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.statusMessage = page.getByRole('status');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async signIn(user: Pick<AuthTestUser, 'email' | 'password'>): Promise<void> {
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.submitButton.click();
  }
}
