# E2E Tests

End-to-end tests for Finance Tracker using Playwright.

## Setup

Install dependencies:

```bash
npm install
npx playwright install  # Install browsers
```

## Running Tests

```bash
# Run all tests in headless mode
npm test

# Run tests in headed mode (see the browser)
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Debug tests
npm run test:debug

# Run specific test file
npx playwright test tests/auth.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

## View Test Reports

```bash
npm run report
```

## Generate Tests

Use Playwright's codegen tool to generate tests by interacting with your app:

```bash
npm run codegen
```

## Prerequisites

Before running tests, make sure:
1. Backend server is running on `http://localhost:3000`
2. Frontend dev server is running on `http://localhost:5173`
3. PostgreSQL database is set up and migrations are run

The `webServer` configuration in `playwright.config.ts` will automatically start these servers if they're not already running.

## Test Structure

- `tests/auth.spec.ts` - Authentication tests (login, register, logout)
- `tests/profile.spec.ts` - User profile tests
- `tests/dashboard.spec.ts` - Dashboard functionality tests

## Writing Tests

Example test:

```typescript
import { test, expect } from '@playwright/test';

test('should login successfully', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill('test@example.com');
  await page.getByLabel(/password/i).fill('Test1234');
  await page.getByRole('button', { name: /login/i }).click();

  await expect(page).toHaveURL('/dashboard');
});
```

## CI/CD Integration

Tests can be run in GitHub Actions. Add this to your workflow:

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm test
```

## Configuration

Edit `playwright.config.ts` to:
- Change test directory
- Modify browser configurations
- Update base URL
- Adjust timeouts
- Configure reporters

## Debugging

1. **Use --debug flag**: Shows browser devtools and pauses test execution
2. **Use --headed flag**: Shows the browser while tests run
3. **Use --ui flag**: Interactive mode to step through tests
4. **Screenshots**: Automatically captured on failure
5. **Traces**: Captured on first retry for failed tests

## Best Practices

1. Use `test.beforeEach()` for common setup
2. Use descriptive test names
3. Use role-based selectors (`getByRole`, `getByLabel`)
4. Avoid hard-coded waits - use `waitFor` assertions
5. Clean up test data after tests
6. Make tests independent and isolated
7. Use page object model for complex pages

## Troubleshooting

**Tests timing out:**
- Increase timeout in config: `timeout: 60000`
- Check if servers are running
- Check network connectivity

**Flaky tests:**
- Use proper wait strategies
- Avoid hard-coded delays
- Make tests more resilient to timing issues

**Browser not found:**
- Run `npx playwright install`

**Database conflicts:**
- Use unique data for each test run (timestamps)
- Clean up test data after each test
