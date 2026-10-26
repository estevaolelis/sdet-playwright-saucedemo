import { Locator, Page } from '@playwright/test' // Depois adiciona o Locator
import { HeaderComponent } from './HeaderComponent';

export class Inventory {
    readonly page: Page;
    readonly header: HeaderComponent;
    readonly title: Locator;
    readonly items: Locator;
    readonly sortDropdown: Locator;

    constructor(page: Page) {
        this.page = page
        this.header = new HeaderComponent(page);
        this.title = page.getByTestId('title');
        this.items = page.getByTestId('inventory-item');
        this.sortDropdown = page.getByTestId('product-sort-container');
    }

    product(name: string): Locator {
        return this.items.filter({ hasText: name })
    }
}