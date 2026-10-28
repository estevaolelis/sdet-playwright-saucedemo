# SDET Playwright - SauceDemo

![Playwright Tests](https://github.com/estevaolelis/sdet-playwright-saucedemo/actions/workflows/playwright.yml/badge.svg)

End-to-end test automation project built with **Playwright** and **TypeScript**, targeting the practice website [SauceDemo](https://www.saucedemo.com). The goal is to practice and showcase SDET best practices: Page Object, fixtures, code quality, and CI.

**Latest test reports:** [Playwright HTML](https://estevaolelis.github.io/sdet-playwright-saucedemo/) · [Allure](https://estevaolelis.github.io/sdet-playwright-saucedemo/allure/)

## Tech stack

- [Playwright](https://playwright.dev) (`@playwright/test`)
- TypeScript
- ESLint with `eslint-plugin-playwright`
- [Allure Report](https://allurereport.org) (alternative test report)
- GitHub Actions (CI) and GitHub Pages (test reports)

## Project structure

```
.
├── .github/workflows/   # CI pipeline (GitHub Actions)
├── fixtures/            # Custom Playwright fixtures
├── pages/               # Page Objects
├── tests/               # Test specs
├── utils/               # Helpers and test data (price parsing, users)
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

| Command                      | Description                                    |
| ---------------------------- | ---------------------------------------------- |
| `npm run test:smoke`         | Runs only the critical tests (`@smoke`)        |
| `npm run test:regression`    | Runs the full suite (`@regression`)            |
| `npm run test:known-issues`  | Runs only the known-bug tests (`@known-issue`) |
| `npx playwright test --ui`   | Opens the interactive UI mode                  |
| `npx playwright show-report` | Opens the HTML report of the last run          |
| `npm run report:allure`      | Generates and opens the Allure report          |
| `npm run lint`               | Runs ESLint                                    |
| `npm run lint:fix`           | Automatically fixes ESLint issues              |
| `npm run typecheck`          | Type-checks the project with TypeScript        |
| `npm run format`             | Formats the code with Prettier                 |
| `npm run format:check`       | Checks formatting without changing files       |

## Conventions

- **Page Object**: each page is a class holding its locators and actions. Assertions (`expect`) stay in the tests.
- **Components**: elements shared across pages (like the header with the cart) live in their own class.
- **Fixtures**: Page Objects are provided to the tests ready to use, with no repeated `new`.
- **Stable locators**: uses `getByTestId` (SauceDemo's `data-test` attribute) and `getByRole`.
- **Independent tests**: each test runs in isolation and does not depend on any other.
- **Data-driven tests**: repeated scenarios (such as the six products) are generated from a list.
- **Tags**: every `describe` is tagged `@regression` (full suite). Critical happy-path tests also get `@smoke`, for a fast health check. Tests that document a known bug get `@known-issue`.

## Continuous integration

The pipeline runs on every push and pull request to `main`, on a weekday schedule (09:00 UTC), and on demand:

```
quality ──► test (3 shards) ──► report ──► deploy-report (main only)
   └────────────┴──────► ci-status
```

1. **quality**: format check (Prettier), lint (ESLint), and type check (`tsc`).
2. **test**: the suite is split into 3 shards that run in parallel, each inside the official Playwright Docker image (`mcr.microsoft.com/playwright`).
3. **report**: merges the shards into one Playwright HTML report and generates the Allure report.
4. **deploy-report**: publishes both reports to [GitHub Pages](https://estevaolelis.github.io/sdet-playwright-saucedemo/).
5. **ci-status**: one check that fails if lint or tests fail. It is the required check in the branch protection rule, so a pull request cannot be merged while it is red.

The scheduled run catches flaky tests and changes on SauceDemo even when nobody pushes code.

## Test coverage

- [x] Login: every valid user (parametrized), with a longer timeout only for `performance_glitch_user`, and the locked-out user
- [x] Known issues of `problem_user`, `error_user`, and `visual_user` (see below)
- [x] Access control: protected pages redirect to the login screen
- [x] Inventory: product list and sorting (price and name)
- [x] Product detail: data matches the inventory list, for all six products
- [x] Cart: add, remove, badge, and persistence
- [x] Checkout: complete purchase (happy path), order summary totals, and required-field validation

## Known issues

SauceDemo has special users with bugs on purpose. Their tests assert the **correct** behavior and are marked with [`test.fail()`](https://playwright.dev/docs/api/class-test#test-fail), so the suite stays green while the bugs exist. If a bug is ever fixed, its test passes unexpectedly, Playwright reports it as a failure, and the `test.fail()` must be removed. Each test carries an `issue` annotation that describes the bug in the HTML and Allure reports.

| User           | Expected behavior                                      | Actual behavior (bug)                                                      |
| -------------- | ------------------------------------------------------ | -------------------------------------------------------------------------- |
| `problem_user` | Each product shows its own image                       | All products show the same placeholder image                               |
| `problem_user` | Sorting by name and by price works                     | Sorting does nothing                                                       |
| `problem_user` | Every product can be added to the cart                 | Bolt T-Shirt, Fleece Jacket, and Test.allTheThings() T-Shirt are not added |
| `problem_user` | Remove on the inventory list clears the badge          | Remove does nothing                                                        |
| `problem_user` | The detail page shows the clicked product              | It opens the next product (id + 1)                                         |
| `problem_user` | The checkout form keeps the typed values               | Typing in Last Name overwrites First Name                                  |
| `error_user`   | Sorting works                                          | An alert says "Sorting is broken!" and the list does not change            |
| `error_user`   | Every product can be added to the cart                 | Same three products are not added                                          |
| `error_user`   | Remove on the inventory list clears the badge          | Remove does nothing                                                        |
| `error_user`   | The checkout form keeps the typed Last Name            | Last Name stays empty, yet the form lets the user continue                 |
| `error_user`   | Finish completes the order                             | Finish does nothing                                                        |
| `visual_user`  | Prices match `standard_user`                           | Prices are random on every render                                          |
| `visual_user`  | Images match `standard_user`                           | Sauce Labs Backpack shows the placeholder image                            |
| `visual_user`  | The cart icon is where it is for `standard_user`       | It is shifted left and down                                                |
| `visual_user`  | The Checkout button is where it is for `standard_user` | It is pulled to the top of the cart page                                   |

The `visual_user` tests open a second page logged in as `standard_user` at the same viewport (the `standardUserPage` fixture) and compare prices, images, and element positions. This catches the layout bugs without screenshot baselines, which would differ between local machines and CI.

A `test.fail()` test passes on **any** failure, not only on the bug. To keep that honest, each `beforeEach` waits for the product list before the test reads it, and every test was checked once without `test.fail()` to confirm it fails on the bug's own assertion.

## Roadmap

- [ ] More login scenarios (wrong password, empty fields)
- [ ] Checkout cancel flow
- [ ] Reuse login with `storageState`
- [ ] Accessibility and visual regression tests
- [ ] API tests (in a separate project, since SauceDemo has no public API)

## Author

Estevão Lélis - [GitHub](https://github.com/estevaolelis)
