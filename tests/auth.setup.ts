import { test as setup, expect } from "@playwright/test"
import { PASSWORD, USERS } from "../utils/users"
import { LoginPage } from "../pages/LoginPage";

const authFile = "playwright/.auth/standard.json"

setup("authenticate as standard user", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto()
    await loginPage.login(USERS.standard, PASSWORD)
    await expect(page).toHaveURL(/inventory/);

    await page.context().storageState({ path: authFile })
})