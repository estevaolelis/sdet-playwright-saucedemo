import { Page, Locator } from "@playwright/test";

export class HeaderComponent{
    readonly cartLink: Locator;
    readonly cartBadge: Locator;
    readonly menuButton: Locator;

    constructor(page: Page) {
        this.cartLink = page.getByTestId('shopping-cart-link')
        this.cartBadge = page.getByTestId('shopping-cart-badge');
        this.menuButton = page.getByRole('button', {name: "Open Menu"})
    }

    async openCart() {
        await this.cartLink.click();
    }
}