import { test, expect } from "../fixtures";

test.describe("Cart", { tag: "@regression" }, () => {
  const productName = "Sauce Labs Backpack";

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login("standard_user", "secret_sauce");
  });

  test.describe("adding products", () => {
    test(
      "adding a product updates the badge and the button",
      { tag: "@smoke" },
      async ({ inventoryPage }) => {
        await inventoryPage.addToCart(productName);

        await expect(inventoryPage.header.cartBadge).toHaveText("1");
        await expect(
          inventoryPage
            .product(productName)
            .getByRole("button", { name: "Remove" }),
        ).toBeVisible();
      },
    );

    test("adding several products shows all of them in the cart", async ({
      inventoryPage,
      cartPage,
      page,
    }) => {
      const productNames = [
        "Sauce Labs Backpack",
        "Sauce Labs Bike Light",
        "Sauce Labs Onesie",
      ];

      for (const name of productNames) {
        await inventoryPage.addToCart(name);
      }
      await expect(inventoryPage.header.cartBadge).toHaveText(
        String(productNames.length),
      );

      await inventoryPage.header.openCart();
      await expect(page).toHaveURL(/cart\.html/);

      await expect(cartPage.items).toHaveCount(productNames.length);
      await expect(cartPage.itemNames).toHaveText(productNames);
    });
  });

  test.describe("removing products", () => {
    test("removing from the list clears the badge", async ({
      inventoryPage,
    }) => {
      await inventoryPage.addToCart(productName);
      await inventoryPage.removeFromCart(productName);

      await expect(inventoryPage.header.cartBadge).toBeHidden();
      await expect(
        inventoryPage
          .product(productName)
          .getByRole("button", { name: "Add to cart" }),
      ).toBeVisible();
    });

    test("removing inside the cart removes the item", async ({
      inventoryPage,
      cartPage,
      page,
    }) => {
      const removedProduct = "Sauce Labs Backpack";
      const keptProduct = "Sauce Labs Bike Light";

      await inventoryPage.addToCart(removedProduct);
      await inventoryPage.addToCart(keptProduct);
      await inventoryPage.header.openCart();
      await expect(page).toHaveURL(/cart\.html/);
      await expect(cartPage.items).toHaveCount(2);

      await cartPage.removeItem(removedProduct);

      await expect(cartPage.itemNames).toHaveText([keptProduct]);
      await expect(inventoryPage.header.cartBadge).toHaveText("1");
    });
  });

  test.describe("persistence", () => {
    test("cart survives opening a product and going back", async ({
      inventoryPage,
      productDetailPage,
      page,
    }) => {
      await inventoryPage.addToCart(productName);

      await inventoryPage.openProduct(productName);
      await expect(productDetailPage.backButton).toBeVisible();
      await productDetailPage.backToProducts();

      await expect(page).toHaveURL(/inventory\.html/);
      await expect(inventoryPage.items).toHaveCount(6);
      await expect(inventoryPage.header.cartBadge).toHaveText("1");
      await expect(
        inventoryPage
          .product(productName)
          .getByRole("button", { name: "Remove" }),
      ).toBeVisible();
    });

    test("cart survives a page reload", async ({ inventoryPage, page }) => {
      await inventoryPage.addToCart(productName);
      await expect(inventoryPage.header.cartBadge).toHaveText("1");

      await page.reload();

      await expect(inventoryPage.header.cartBadge).toHaveText("1");
      await expect(
        inventoryPage
          .product(productName)
          .getByRole("button", { name: "Remove" }),
      ).toBeVisible();
    });
  });
});
