import { test, expect } from '../fixtures';

test.describe('Login', { tag: '@regression' }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test.describe('with valid credentials', () => {
    test('standard user lands on the inventory page', { tag: '@smoke' }, async ({ loginPage, page }) => {
      await loginPage.login('standard_user', 'secret_sauce');
      await expect(page).toHaveURL(/inventory/);
    });

    test('slow user (performance_glitch_user) still logs in', async ({ loginPage, page }) => {
      test.slow();
      await loginPage.login('performance_glitch_user', 'secret_sauce');
      await expect(page).toHaveURL(/inventory/, { timeout: 20_000 });
    });
  });

  test.describe('with invalid credentials', () => {
    test('locked out user sees an error message', async ({ loginPage }) => {
      await loginPage.login('locked_out_user', 'secret_sauce');
      await expect(loginPage.errorMessage).toContainText('locked out');
    });
  });
});