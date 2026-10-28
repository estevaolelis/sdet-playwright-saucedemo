import { test, expect } from "../fixtures";
import { parsePrice } from "../utils/price";

test.describe("Checkout", { tag: "@regression" }, () => {
  const productName = "Sauce Labs Backpack";

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
  });

  test("completes a purchase with a single product", { tag: "@smoke" }, async ({ inventoryPage, cartPage, checkoutPage, checkoutOverviewPage, checkoutCompletePage, page }) => {
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
  });

  test("order summary totals add up with several products", { tag: "@regression" }, async ({ inventoryPage, cartPage, checkoutPage, checkoutOverviewPage, page }) => {
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

  test.describe("empty data in checkout", () => {
    test.beforeEach(async ({ inventoryPage, cartPage, page }) => {
      await inventoryPage.addToCart(productName);
      await inventoryPage.header.openCart();
      await expect(page).toHaveURL(/cart\.html/);

      await cartPage.clickCheckout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);
    });

    const validInfo = { firstName: "Test", lastName: "User", postalCode: "12345-000" };

    const invalidCases = [
      { name: "first name", info: { ...validInfo, firstName: "" }, error: "Error: First Name is required" },
      { name: "last name", info: { ...validInfo, lastName: "" }, error: "Error: Last Name is required" },
      { name: "postal code", info: { ...validInfo, postalCode: "" }, error: "Error: Postal Code is required" },
    ];

    for (const { name, info, error } of invalidCases) {
      test(`shows an error when ${name} is empty`, async ({ checkoutPage, page }) => {
        await checkoutPage.fillInformation(info);
        await checkoutPage.clickContinue();

        await expect(checkoutPage.errorMessage).toHaveText(error);
        await expect(page).toHaveURL(/checkout-step-one\.html/);
      });
    }
  });
});
