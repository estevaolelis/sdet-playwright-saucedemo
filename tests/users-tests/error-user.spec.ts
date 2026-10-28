import { test, expect } from "../../fixtures";
import { PASSWORD, USERS } from "../../utils/users";

test.describe("error_user known issues", { tag: ["@regression", "@known-issue"] }, () => {
  const productName = "Sauce Labs Backpack";

  test.beforeEach(async ({ loginPage, inventoryPage, page }) => {
    await loginPage.goto();
    await loginPage.login(USERS.error, PASSWORD);
    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test.fail("sort by name Z to A", { annotation: { type: "issue", description: 'Sorting shows the alert "Sorting is broken!" and the list stays A to Z' } }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy("za");
    const products = await inventoryPage.getProductsNames();
    expect(products).toEqual([...products].sort().reverse());
  });

  test.fail(
    "every product can be added to the cart",
    { annotation: { type: "issue", description: "Add to cart does nothing for Bolt T-Shirt, Fleece Jacket and Test.allTheThings() T-Shirt" } },
    async ({ inventoryPage }) => {
      for (const name of await inventoryPage.getProductsNames()) {
        await inventoryPage.addToCart(name);
      }
      await expect(inventoryPage.header.cartBadge).toHaveText("6");
    },
  );

  test.fail("removing from the list clears the badge", { annotation: { type: "issue", description: "The Remove button on the inventory list does nothing" } }, async ({ inventoryPage }) => {
    await inventoryPage.addToCart(productName);
    await expect(inventoryPage.header.cartBadge).toHaveText("1");

    await inventoryPage.removeFromCart(productName);
    await expect(inventoryPage.header.cartBadge).toBeHidden();
  });

  test.describe("checkout", () => {
    test.beforeEach(async ({ inventoryPage, cartPage, checkoutPage, page }) => {
      await inventoryPage.addToCart(productName);
      await inventoryPage.header.openCart();
      await cartPage.clickCheckout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);

      await checkoutPage.fillInformation({ firstName: "Test", lastName: "User", postalCode: "12345-000" });
    });

    test.fail(
      "form keeps the typed last name",
      { annotation: { type: "issue", description: "The Last Name field ignores typing, yet the form still lets the user continue" } },
      async ({ checkoutPage }) => {
        await expect(checkoutPage.lastName).toHaveValue("User");
      },
    );

    test.fail(
      "finish completes the order",
      { annotation: { type: "issue", description: "The Finish button does nothing and the user stays on the overview page" } },
      async ({ checkoutPage, checkoutOverviewPage, page }) => {
        await checkoutPage.clickContinue();
        await expect(page).toHaveURL(/checkout-step-two\.html/);

        await checkoutOverviewPage.clickFinish();
        await expect(page).toHaveURL(/checkout-complete\.html/);
      },
    );
  });
});
