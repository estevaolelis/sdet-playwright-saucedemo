import { test, expect } from "../fixtures";
import { parsePrice } from "../utils/price";

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

      const { subtotal, tax, total } = await checkoutOverviewPage.getAmounts();
      expect(subtotal).toBeCloseTo(parsePrice(price), 2);
      expect(total).toBeCloseTo(subtotal + tax, 2);

      await expect(page).toHaveURL(/checkout-step-two\.html/);
      await expect(checkoutOverviewPage.itemNames).toHaveText([productName]);

      await checkoutOverviewPage.clickFinish();

      await expect(page).toHaveURL(/checkout-complete\.html/);
      await expect(checkoutCompletePage.header).toBeVisible();
    },
  );

  test("order summary totals add up with several products", { tag: "@regression" },async ({
    inventoryPage,
    cartPage,
    checkoutPage,
    checkoutOverviewPage,
    page,
  }) => {
    const productNames = ["Sauce Labs Backpack", "Sauce Labs Bike Light"];

    let expectedSubtotal = 0;
    for (const name of productNames) {
      const { price } = await inventoryPage.getProductsInfo(name);
      expectedSubtotal += parsePrice(price);
      await inventoryPage.addToCart(name);
    }

    await inventoryPage.header.openCart();
    await cartPage.clickCheckout();
    await checkoutPage.fillInformation({
      firstName: "Test",
      lastName: "User",
      postalCode: "12345-000",
    });
    await checkoutPage.clickContinue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);
    await expect(checkoutOverviewPage.itemNames).toHaveText(productNames);

    const { subtotal, tax, total } = await checkoutOverviewPage.getAmounts();
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });
});
