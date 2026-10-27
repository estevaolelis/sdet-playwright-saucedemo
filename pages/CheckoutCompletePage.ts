import { Locator, Page } from "@playwright/test";

export class CheckoutCompletePage {
  readonly page: Page;
  readonly header: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByTestId("complete-header");
    this.backHomeButton = page.getByTestId("back-to-products");
  }
}
