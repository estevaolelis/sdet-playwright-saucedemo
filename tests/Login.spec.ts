import { test, expect } from '../fixtures';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('login with valid user', async ({ loginPage, page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
  });

  test('error with locked user', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    await expect(loginPage.errorMessage).toContainText('locked out');
  });
  
  test('login but with some bugs', async ({ loginPage, page }) => {
    await loginPage.login('performance_glitch_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/, { timeout: 30000 });
  })
});