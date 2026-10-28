import { test, expect } from "../fixtures";
import { PASSWORD, USERS } from "../utils/users";

test.describe("Login", { tag: "@regression" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test.describe("with valid credentials", () => {
    test(`${USERS.standard} lands on the inventory page`, { tag: "@smoke" }, async ({ loginPage, page }) => {
      await loginPage.login(USERS.standard, PASSWORD);
      await expect(page).toHaveURL(/inventory/);
    });

    const otherUsers = [
      { username: USERS.problem, slow: false },
      { username: USERS.performanceGlitch, slow: true },
      { username: USERS.error, slow: false },
      { username: USERS.visual, slow: false },
    ];

    for (const { username, slow } of otherUsers) {
      test(`${username} lands on the inventory page`, async ({ loginPage, page }) => {
        test.slow(slow, "performance_glitch_user logs in slowly on purpose");

        await loginPage.login(username, PASSWORD);
        await expect(page).toHaveURL(/inventory/, { timeout: slow ? 20_000 : undefined });
      });
    }
  });

  test.describe("with invalid credentials", () => {
    test("locked out user sees an error message", async ({ loginPage, page }) => {
      await loginPage.login(USERS.lockedOut, PASSWORD);
      await expect(loginPage.errorMessage).toContainText("locked out");
      await expect(page).not.toHaveURL(/inventory/);
    });
  });
});
