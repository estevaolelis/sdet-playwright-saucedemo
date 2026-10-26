import { Page, Locator } from '@playwright/test';
import { HeaderComponent } from './HeaderComponent';

export class ProductDetailPage {
    readonly page: Page;
    readonly header: HeaderComponent;
    readonly name: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly image: Locator;
    readonly backButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = new HeaderComponent(page);
        this.name = page.getByTestId('inventory-item-name');
        this.description = page.getByTestId('inventory-item-desc');
        this.price = page.getByTestId('inventory_details_price');
        this.image = page.getByTestId('inventory_details_img');
        this.backButton = page.getByTestId('back-image')
    }

    async backToProducts() {
        await this.backButton.click()
    }
}