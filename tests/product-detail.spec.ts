// tests/product-detail.spec.ts
import { test, expect } from "../fixtures";

test.describe("Product detail", { tag: "@regression" }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
  });

  const productNames = [
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
    "Sauce Labs Bolt T-Shirt",
    "Sauce Labs Fleece Jacket",
    "Sauce Labs Onesie",
    "Test.allTheThings() T-Shirt (Red)",
  ];

  for (const productName of productNames) {
    test(`shows the same data as the inventory list: ${productName}`, async ({
      inventoryPage,
      productDetailPage,
    }) => {
      const info = await inventoryPage.getProductsInfo(productName);
      await inventoryPage.openProduct(productName);
      await productDetailPage.waitForLoaded();

      await expect(productDetailPage.name).toHaveText(info.name);
      await expect(productDetailPage.description).toHaveText(info.description);
      await expect(productDetailPage.price).toHaveText(info.price);
      await expect(productDetailPage.image).toBeVisible();
    });
  }

  test(
    "back button returns to the inventory list",
    { tag: "@smoke" },
    async ({ inventoryPage, productDetailPage, page }) => {
      const productName = "Sauce Labs Backpack";

      await inventoryPage.openProduct(productName);
      await productDetailPage.waitForLoaded();

      await productDetailPage.backToProducts();

      await expect(page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.items).toHaveCount(6);
    },
  );
});
