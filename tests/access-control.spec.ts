import { test, expect } from "../fixtures";

const protectedRoutes = [
  "/inventory.html",
  "/cart.html",
  "/checkout-step-one.html",
  "/checkout-step-two.html",
  "/checkout-complete.html",
];

test.describe("Access control", { tag: "@regression" }, () => {
  for (const route of protectedRoutes) {
    test(`Without login, ${route} redirect to login`, async ({
      page,
      loginPage,
    }) => {
      await page.goto(route);

      await expect(page).toHaveURL("/");
      await expect(loginPage.errorMessage).toContainText(
        "when you are logged in",
      );
    });
  }
});
