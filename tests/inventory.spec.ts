import { test, expect } from "../fixtures";

test.describe(`Inventory`, { tag: "@regression" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
  });

  test("display 6 products", { tag: "@smoke" }, async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test(
    "adding a product updates the cart badge",
    { tag: "@smoke" },
    async ({ inventoryPage }) => {
      await inventoryPage.addToCart("Sauce Labs Backpack");
      await expect(inventoryPage.header.cartBadge).toHaveText("1");
    },
  );

  test("removing a product clears the cart badge", async ({
    inventoryPage,
  }) => {
    await inventoryPage.addToCart("Sauce Labs Backpack");
    await inventoryPage.removeFromCart("Sauce Labs Backpack");
    await expect(inventoryPage.header.cartBadge).toBeHidden();
  });

  test("sort by price ascending", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("lohi");
    const prices = await inventoryPage.getProductsPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test("sort by name Z to A", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("za");
    const products = await inventoryPage.getProductsNames();
    expect(products).toEqual([...products].sort().reverse());
  });
});
