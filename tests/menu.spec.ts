import { test, expect } from "../fixtures";
import { PASSWORD, USERS } from "../utils/users";

test.describe("Menu", { tag: "@regression" }, () => {
  test.beforeEach(async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(USERS.standard, PASSWORD);
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test.describe("opening and closing", () => {
    test("menu is closed after login", async ({ inventoryPage }) => {
      await expect(inventoryPage.header.menu.wrapper).toHaveAttribute("aria-hidden", "true");
    });

    test("opening the menu shows all links", async ({ inventoryPage }) => {
      const { menu } = inventoryPage.header;

      await menu.open();

      await expect(menu.wrapper).toHaveAttribute("aria-hidden", "false");
      for (const link of [menu.allItemsLink, menu.dynamicCatalogLink, menu.aboutLink, menu.logoutLink, menu.resetLink]) {
        await expect(link).toBeVisible();
      }
    });

    test("closing the menu hides it", async ({ inventoryPage }) => {
      const { menu } = inventoryPage.header;

      await menu.open();
      await menu.close();

      await expect(menu.wrapper).toHaveAttribute("aria-hidden", "true");
      await expect(menu.logoutLink).toBeHidden();
    });
  });

  test.describe("navigation", () => {
    test("All Items returns to the inventory from a product page", async ({ inventoryPage, productDetailPage, page }) => {
      await inventoryPage.openProduct("Sauce Labs Backpack");

      await productDetailPage.header.menu.goToAllItems();

      await expect(page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.items).toHaveCount(6);
    });

    test("About points to the Sauce Labs website", async ({ inventoryPage }) => {
      await inventoryPage.header.menu.open();

      await expect(inventoryPage.header.menu.aboutLink).toHaveAttribute("href", "https://saucelabs.com/");
    });

    test("Dynamic Catalog expands its submenu", async ({ inventoryPage }) => {
      const { menu } = inventoryPage.header;

      await menu.expandDynamicCatalog();

      await expect(menu.dynamicCatalogLink).toHaveAttribute("aria-expanded", "true");
      await expect(menu.dynamicCatalogSubmenu.getByRole("button")).toHaveText(["Lazy Load", "Spinner", "Slider"]);
    });
  });

  test.describe("logout", () => {
    test("logging out returns to the login page", { tag: "@smoke" }, async ({ inventoryPage, loginPage, page }) => {
      await inventoryPage.header.menu.logout();

      await expect(page).toHaveURL("/");
      await expect(loginPage.loginButton).toBeVisible();
    });

    test("after logout, protected pages require login again", async ({ inventoryPage, loginPage, page }) => {
      await inventoryPage.header.menu.logout();

      await page.goto("/inventory.html");

      await expect(page).toHaveURL("/");
      await expect(loginPage.errorMessage).toContainText("when you are logged in");
    });
  });

  test.describe("reset app state", () => {
    const productName = "Sauce Labs Backpack";

    test("reset clears the cart badge", async ({ inventoryPage }) => {
      await inventoryPage.addToCart(productName);
      await expect(inventoryPage.header.cartBadge).toHaveText("1");

      await inventoryPage.header.menu.resetAppState();

      await expect(inventoryPage.header.cartBadge).toBeHidden();
    });

    test.fail(
      "reset restores the Add to cart buttons",
      { tag: "@known-issue", annotation: { type: "issue", description: "After reset the product button still shows Remove until the page is reloaded" } },
      async ({ inventoryPage }) => {
        await inventoryPage.addToCart(productName);

        await inventoryPage.header.menu.resetAppState();

        await expect(inventoryPage.product(productName).getByRole("button", { name: "Add to cart" })).toBeVisible({ timeout: 2000 });
      },
    );
  });
});
