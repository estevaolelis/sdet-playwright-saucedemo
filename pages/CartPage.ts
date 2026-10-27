import { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly items: Locator;
  readonly itemNames: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.items = page.getByTestId('inventory-item');
    this.itemNames = page.getByTestId('inventory-item-name');
    this.checkoutButton = page.getByTestId('checkout');
    this.continueShoppingButton = page.getByTestId('continue-shopping');
  }

  item(name: string): Locator {
    return this.items.filter({ hasText: name });
  }

  async removeItem(name: string) {
    await this.item(name).getByRole('button', { name: 'Remove' }).click();
  }

  async clickCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}