import { Page, Locator } from '@playwright/test'

export class LoginPage {
    readonly page: Page;
    readonly userNameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userNameInput = page.getByTestId('username');
        this.passwordInput = page.getByTestId('password');
        this.loginButton = page.getByTestId('login-button');
        this.errorMessage = page.getByTestId('error');
    }

    async goto() {
        await this.page.goto('/');
    }

    async login(user: string, password: string) {
        await this.userNameInput.fill(user);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}