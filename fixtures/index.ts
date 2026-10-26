import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';

type MyFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage
  productDetailPage: ProductDetailPage
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({page}, use) => {
    await use(new InventoryPage(page));
  },
  productDetailPage: async ({page}, use) => {
    await use(new ProductDetailPage(page))
  }
});

export { expect } from '@playwright/test';