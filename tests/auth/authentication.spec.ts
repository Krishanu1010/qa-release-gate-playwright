import { expect, test } from '../../src/fixtures/test';

test.describe('Authentication and authorization', () => {
  test('protects session and staff APIs from anonymous requests', async ({ request }) => {
    const sessionResponse = await request.get('/api/session');
    const staffResponse = await request.get('/api/staff/reports');

    expect(sessionResponse.status()).toBe(401);
    expect(staffResponse.status()).toBe(401);
  });

  test('rejects invalid credentials without creating a session', async ({ authUsers, loginPage, page }) => {
    await loginPage.goto();
    await loginPage.signIn({
      email: authUsers.customer.email,
      password: `${authUsers.customer.password}-incorrect`,
    });

    await expect(loginPage.statusMessage).toHaveText('Email or password is incorrect.');
    await expect(page).toHaveURL(/\/login$/);
    const sessionResponse = await page.request.get('/api/session');
    expect(sessionResponse.status()).toBe(401);
  });

  test('persists a customer session across reloads and denies staff access', async ({
    accountPage,
    authUsers,
    loginPage,
    page,
  }) => {
    await loginPage.goto();
    await loginPage.signIn(authUsers.customer);

    await expect(accountPage.heading).toBeVisible();
    await expect(accountPage.welcomeMessage).toHaveText('Welcome, Casey Customer.');
    await expect(accountPage.roleMessage).toHaveText('Role: customer');
    const staffResponse = await page.request.get('/api/staff/reports');
    expect(staffResponse.status()).toBe(403);

    await accountPage.reload();
    await expect(accountPage.heading).toBeVisible();
    await accountPage.signOut();

    await expect(page).toHaveURL(/\/login$/);
    const sessionResponse = await page.request.get('/api/session');
    expect(sessionResponse.status()).toBe(401);
  });

  test('allows an agent to access staff reports', async ({ authUsers, loginPage, page }) => {
    await loginPage.goto();
    await loginPage.signIn(authUsers.agent);

    await expect(page.getByRole('heading', { name: 'Account overview' })).toBeVisible();
    const response = await page.request.get('/api/staff/reports');
    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ reports: [{ id: 'RPT-01', status: 'ready' }] });
  });
});
