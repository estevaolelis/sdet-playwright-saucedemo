import { test, expect } from "../../fixtures";
import { InventoryPage } from "../../pages/InventoryPage";
import { CartPage } from "../../pages/CartPage";
import { PASSWORD, USERS } from "../../utils/users";

test.describe("visual_user known issues", { tag: ["@regression", "@known-issue"] }, () => {
  test.beforeEach(async ({ loginPage, inventoryPage, page }) => {
    await loginPage.goto();
    await loginPage.login(USERS.visual, PASSWORD);
    await expect(page).toHaveURL(/inventory/);
    await expect(inventoryPage.items).toHaveCount(6);
  });

  test.fail(
    "product prices match standard_user",
    { annotation: { type: "issue", description: "Inventory prices are random and change on every render" } },
    async ({ inventoryPage, standardUserPage }) => {
      const expected = await new InventoryPage(standardUserPage).getProductsPrices();
      expect(await inventoryPage.getProductsPrices()).toEqual(expected);
    },
  );

  test.fail("product images match standard_user", { annotation: { type: "issue", description: "Sauce Labs Backpack shows the placeholder image" } }, async ({ inventoryPage, standardUserPage }) => {
    const expected = await new InventoryPage(standardUserPage).getProductsImages();
    expect(await inventoryPage.getProductsImages()).toEqual(expected);
  });

  test.fail(
    "cart icon is in the same place as for standard_user",
    { annotation: { type: "issue", description: "The cart icon is shifted left and down in the header" } },
    async ({ inventoryPage, standardUserPage }) => {
      const expected = await new InventoryPage(standardUserPage).header.cartLink.boundingBox();
      expect(await inventoryPage.header.cartLink.boundingBox()).toEqual(expected);
    },
  );

  test.fail(
    "checkout button is in the same place as for standard_user",
    { annotation: { type: "issue", description: "The Checkout button is pulled out of place, to the top of the cart page" } },
    async ({ cartPage, page, standardUserPage }) => {
      await page.goto("/cart.html");
      await standardUserPage.goto("/cart.html");
      await expect(cartPage.checkoutButton).toBeVisible();

      const expected = await new CartPage(standardUserPage).checkoutButton.boundingBox();
      expect(await cartPage.checkoutButton.boundingBox()).toEqual(expected);
    },
  );
});
