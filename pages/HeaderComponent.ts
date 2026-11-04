import { Page, Locator } from "@playwright/test";
import { MenuComponent } from "./MenuComponent";

export class HeaderComponent {
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menu: MenuComponent;

  constructor(page: Page) {
    this.cartLink = page.getByTestId("shopping-cart-link");
    this.cartBadge = page.getByTestId("shopping-cart-badge");
    this.menu = new MenuComponent(page);
  }

  async openCart() {
    await this.cartLink.click();
  }
}
