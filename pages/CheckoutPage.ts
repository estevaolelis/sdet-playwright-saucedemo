import { Locator, Page } from "@playwright/test";

export type BuyerInfo = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

export class CheckoutPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.getByTestId("firstName");
    this.lastName = page.getByTestId("lastName");
    this.postalCode = page.getByTestId("postalCode");
    this.continueButton = page.getByTestId("continue");
    this.errorMessage = page.getByTestId("error");
  }

  async fillInformation({ firstName, lastName, postalCode }: BuyerInfo) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.postalCode.fill(postalCode);
  }

  async clickContinue() {
    await this.continueButton.click();
  }
}
