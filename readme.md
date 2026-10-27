# SDET Playwright - SauceDemo

![Playwright Tests](https://github.com/estevaolelis/sdet-playwright-saucedemo/actions/workflows/playwright.yml/badge.svg)

End-to-end test automation project built with **Playwright** and **TypeScript**, targeting the practice website [SauceDemo](https://www.saucedemo.com). The goal is to practice and showcase SDET best practices: Page Object, fixtures, code quality, and CI.

**[Latest test report](https://estevaolelis.github.io/sdet-playwright-saucedemo/)**

## Tech stack

- [Playwright](https://playwright.dev) (`@playwright/test`)
- TypeScript
- ESLint with `eslint-plugin-playwright`
- GitHub Actions (CI)

## Project structure

```
.
├── .github/workflows/   # CI pipeline (GitHub Actions)
├── fixtures/            # Custom Playwright fixtures
├── pages/               # Page Objects
├── tests/               # Test specs
├── eslint.config.mjs    # ESLint configuration
├── playwright.config.ts # Playwright configuration
└── tsconfig.json        # TypeScript configuration
```

## Prerequisites

- Node.js LTS
- Git

## Getting started

```bash
# 1. Clone the repository
git clone https://github.com/estevaolelis/sdet-playwright-saucedemo.git
cd sdet-playwright-saucedemo

# 2. Install dependencies
npm ci

# 3. Install the Playwright browser
npx playwright install chromium

# 4. Run the tests
npx playwright test
```

### Useful commands

| Command | Description |
|---|---|
| `npm run test:smoke` | Runs only the critical tests (`@smoke`) |
| `npm run test:regression` | Runs the full suite (`@regression`) |
| `npx playwright test --ui` | Opens the interactive UI mode |
| `npx playwright show-report` | Opens the HTML report of the last run |
| `npm run lint` | Runs ESLint |
| `npm run lint:fix` | Automatically fixes ESLint issues |
| `npm run typecheck` | Type-checks the project with TypeScript |

## Conventions

- **Page Object**: each page is a class holding its locators and actions. Assertions (`expect`) stay in the tests.
- **Fixtures**: Page Objects are provided to the tests ready to use, with no repeated `new`.
- **Stable locators**: uses `getByTestId` (SauceDemo's `data-test` attribute).
- **Independent tests**: each test runs in isolation and does not depend on any other.
- **Tags**: every `describe` is tagged `@regression` (full suite). Critical happy-path tests also get `@smoke`, for a fast health check.

## Continuous integration

On every push or pull request to the `main` branch, GitHub Actions runs:

1. Dependency installation
2. Lint (ESLint)
3. Type check (`tsc`)
4. Playwright tests
5. HTML report upload as an artifact

## Test coverage

- [x] Login with a valid user
- [x] Login with a locked-out user

## Roadmap

- [ ] More login scenarios (wrong password, empty fields)
- [ ] Inventory and cart
- [ ] Checkout
- [ ] API tests
- [ ] Report published on GitHub Pages

## Author

Estevão Lélis - [GitHub](https://github.com/estevaolelis)
