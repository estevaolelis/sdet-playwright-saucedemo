import { Locator, Page } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemNames = page.getByTestId("inventory-item-name");
    this.checkoutButton = page.getByTestId("checkout");
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }
}
