import { Locator, Page } from "@playwright/test";

export class CheckoutOverviewPage {
  readonly page: Page;
  readonly itemNames: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemNames = page.getByTestId("inventory-item-name");
    this.subtotal = page.getByTestId("subtotal-label");
    this.tax = page.getByTestId("tax-label");
    this.total = page.getByTestId("total-label");
    this.finishButton = page.getByTestId("finish");
  }

  async clickFinish() {
    await this.finishButton.click();
  }
}
