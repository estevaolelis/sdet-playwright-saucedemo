import { test, expect } from "../fixtures";

test.describe(`Inventory`, { tag: "@regression" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
  });

  test("display 6 products", { tag: "@smoke" }, async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
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
