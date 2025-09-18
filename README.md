# AniPortfolio

A simple WebApp to track and manage your finantial portfolio and allocations.
You can visualize your portfolio and allocations both graphically and in table format.
You can categorize your investments and set expected returns per category.
This will calculate your overall portfolio expectations and show visually in a drill down manner.
Built with Angular and Firebase.

## Local Development

```
npm install
npm start
```

### Using Mock Services (No Firebase)

For offline or unauthenticated local development the project uses simple in-memory mock service implementations (no network interception, no service worker).

Mocks are enabled via the `environment.useMocks` flag (already `true` in `src/environments/environment.ts`). Production build (`environment.prod.ts`) keeps this `false`.

When mocks are enabled:

- Firebase initialization is skipped.
- `AuthService` and `PortfolioService` are provided by `MockAuthService` and `MockPortfolioService`.

Current dummy data (see `src/app/services/mock-portfolio.service.ts`):

- Allocation sample categories and items with example values.
- Categories with expected returns (e.g. Debt 7%, Equity 12%, Others 5%).

To disable mocks during local dev set:

```ts
// src/environments/environment.ts
export const environment = { production: false, useMocks: false };
```

Then restart the dev server.

## Deploy Preview

```
npm run build
npm run preview
```

## Build and Deploy in Prod

```
npm run build
npm run deploy
```

# TODO : Audit fix, readme
