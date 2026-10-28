import { test, expect } from "../../fixtures";
import { PASSWORD, USERS } from "../../utils/users";

test.describe("problem_user known issues", { tag: ["@regression", "@known-issue"] }, () => {
  const productName = "Sauce Labs Backpack";

  test.beforeEach(async ({ loginPage, inventoryPage, page }) => {
    await loginPage.goto();
    await loginPage.login(USERS.problem, PASSWORD);
    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test.fail("every product shows its own image", { annotation: { type: "issue", description: "All products show the same placeholder image" } }, async ({ inventoryPage }) => {
    const images = await inventoryPage.getProductsImages();
    expect(new Set(images).size).toBe(images.length);
  });

  test.fail("sort by name Z to A", { annotation: { type: "issue", description: "Sorting does nothing, the list stays A to Z" } }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy("za");
    const products = await inventoryPage.getProductsNames();
    expect(products).toEqual([...products].sort().reverse());
  });

  test.fail("sort by price ascending", { annotation: { type: "issue", description: "Sorting does nothing, the list stays A to Z" } }, async ({ inventoryPage }) => {
    await inventoryPage.sortBy("lohi");
    const prices = await inventoryPage.getProductsPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
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

  test.fail(
    "product detail shows the clicked product",
    { annotation: { type: "issue", description: "The detail page opens the next product (id + 1)" } },
    async ({ inventoryPage, productDetailPage }) => {
      await inventoryPage.openProduct(productName);
      await productDetailPage.waitForLoaded();
      await expect(productDetailPage.name).toHaveText(productName);
    },
  );

  test.fail(
    "checkout form keeps the typed values",
    { annotation: { type: "issue", description: "Typing in Last Name overwrites First Name, and Last Name stays empty" } },
    async ({ inventoryPage, cartPage, checkoutPage, page }) => {
      await inventoryPage.addToCart(productName);
      await inventoryPage.header.openCart();
      await cartPage.clickCheckout();
      await expect(page).toHaveURL(/checkout-step-one\.html/);

      await checkoutPage.fillInformation({ firstName: "Test", lastName: "User", postalCode: "12345-000" });

      await expect(checkoutPage.firstName).toHaveValue("Test");
      await expect(checkoutPage.lastName).toHaveValue("User");
    },
  );
});
