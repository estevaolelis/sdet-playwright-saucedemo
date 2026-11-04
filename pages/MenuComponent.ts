import { Locator, Page } from "@playwright/test";

export class MenuComponent {
  readonly page: Page;
  readonly openButton: Locator;
  readonly closeButton: Locator;
  readonly wrapper: Locator;
  readonly allItemsLink: Locator;
  readonly dynamicCatalogLink: Locator;
  readonly dynamicCatalogSubmenu: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.openButton = page.getByRole("button", { name: "Open Menu" });
    this.closeButton = page.getByRole("button", { name: "Close Menu" });
    this.wrapper = page.locator(".bm-menu-wrap");
    this.allItemsLink = page.getByTestId("inventory-sidebar-link");
    this.dynamicCatalogLink = page.getByTestId("dynamic-catalog-sidebar-link");
    this.dynamicCatalogSubmenu = page.getByTestId("dynamic-catalog-submenu");
    this.aboutLink = page.getByTestId("about-sidebar-link");
    this.logoutLink = page.getByTestId("logout-sidebar-link");
    this.resetLink = page.getByTestId("reset-sidebar-link");
  }

  async open() {
    await this.openButton.click();
  }

  async close() {
    await this.closeButton.click();
  }

  async goToAllItems() {
    await this.open();
    await this.allItemsLink.click();
  }

  async expandDynamicCatalog() {
    await this.open();
    await this.dynamicCatalogLink.click();
  }

  async logout() {
    await this.open();
    await this.logoutLink.click();
  }

  async resetAppState() {
    await this.open();
    await this.resetLink.click();
  }
}
