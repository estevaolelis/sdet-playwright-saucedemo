import { Locator, Page } from "@playwright/test";
import { parsePrice } from "../utils/price";

export class CheckoutOverviewPage {
  readonly page: Page;
  readonly itemNames: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemNames = page.getByTestId("inventory-item-name");
    this.subtotal = page.getByTestId("subtotal-label");
    this.tax = page.getByTestId("tax-label");
    this.total = page.getByTestId("total-label");
    this.finishButton = page.getByTestId("finish");
    this.errorMessage = page.getByTestId("error-button")
  }

  async clickFinish() {
    await this.finishButton.click();
  }

  async getAmounts() {
    return {
      subtotal: parsePrice(await this.subtotal.innerText()),
      tax: parsePrice(await this.tax.innerText()),
      total: parsePrice(await this.total.innerText()),
    };
  }
}
