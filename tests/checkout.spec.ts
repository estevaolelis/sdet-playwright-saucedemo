import { test, expect } from "../fixtures";

test.describe("Checkout", { tag: "@regression" }, () => {
  const productName = "Sauce Labs Backpack";

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
  });

  test(
    "completes a purchase with a single product",
    { tag: "@smoke" },
    async ({
      inventoryPage,
      cartPage,
      checkoutPage,
      checkoutOverviewPage,
      checkoutCompletePage,
      page,
    }) => {
      const { price } = await inventoryPage.getProductsInfo(productName);

      await inventoryPage.addToCart(productName);
      await inventoryPage.header.openCart();
      await expect(page).toHaveURL(/cart\.html/);
      await expect(cartPage.itemNames).toHaveText([productName]);

      await cartPage.clickCheckout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);
      await checkoutPage.fillInformation({
        firstName: "Test",
        lastName: "User",
        postalCode: "12345-000",
      });
      await checkoutPage.clickContinue();

      await expect(page).toHaveURL(/checkout-step-two\.html/);
      await expect(checkoutOverviewPage.itemNames).toHaveText([productName]);
      await expect(checkoutOverviewPage.subtotal).toContainText(price);
      await checkoutOverviewPage.clickFinish();

      await expect(page).toHaveURL(/checkout-complete\.html/);
      await expect(checkoutCompletePage.header).toBeVisible();
    },
  );
});
