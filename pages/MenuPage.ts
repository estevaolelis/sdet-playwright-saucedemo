import { Page, Locator } from "@playwright/test";

export class MenuPage {
  readonly page: Page;
  readonly AllItemsButton: Locator;
  readonly DynamicCatalogButton: Locator;
  readonly AboutButton: Locator;
  readonly LogoutButton: Locator;
  readonly ResetAppStateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.AllItemsButton = page.getByTestId("inventory-sidebar-link");
    this.DynamicCatalogButton = page.getByTestId("dynamic-catalog-sidebar-link");
    this.AboutButton = page.getByTestId("about-sidebar-link");
    this.LogoutButton = page.getByTestId("logout-sidebar-link");
    this.ResetAppStateButton = page.getByTestId("reset-sidebar-link");
  }

  async clickOnAllItems() {
    await this.AllItemsButton.click();
  }

  async clickOnDynamicCatalog() {
    await this.DynamicCatalogButton.click();
  }

  async clickOnAbout() {
    await this.AboutButton.click();
  }

  async clickOnLogout() {
    await this.LogoutButton.click();
  }

  async clickOnResetAppState() {
    await this.ResetAppStateButton.click();
  }
}
