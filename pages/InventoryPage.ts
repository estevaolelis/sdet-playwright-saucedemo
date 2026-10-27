import { Locator, Page } from '@playwright/test'
import { HeaderComponent } from './HeaderComponent';

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

export class InventoryPage {
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

    async addToCart(name: string) {
        await this.product(name).getByRole('button', {name: "Add to cart"}).click()
    }

    async removeFromCart(name: string) {
        await this.product(name).getByRole('button', {name: "Remove"}).click()
    }

    async sortBy(option: SortOption) {
        await this.sortDropdown.selectOption(option)
    }

    async openProduct(name: string) {
        await this.product(name).getByTestId('inventory-item-name').click()
        await this.page.waitForURL(/inventory-item/)
    }

    async getProductsNames(): Promise<string[]>{
        return this.page.getByTestId('inventory-item-name').allTextContents()
    }

    async getProductsPrices(): Promise<number[]>{
        const texts = await this.page.getByTestId('inventory_item_price').allTextContents()
        return texts.map((t) => Number.parseFloat(t.replace('$', '')));
    }

    async getProductsInfo(name: string) {
        const card = this.product(name)
        return {
            name: await card.getByTestId('inventory-item-name').innerText(),
            description: await card.getByTestId('inventory-item-desc').innerText(),
            price: await card.getByTestId('inventory-item-price').innerText(),
        }
    }
}