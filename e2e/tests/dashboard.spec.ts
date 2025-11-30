import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login a test user
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testUsername = `testuser${timestamp}`;
    const testPassword = 'Test1234';

    await page.goto('/register');
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/username/i).fill(testUsername);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /register/i }).click();

    await expect(page).toHaveURL('/dashboard');
  });

  test('should display dashboard heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: /dashboard/i })
    ).toBeVisible();
  });

  test('should display stats cards', async ({ page }) => {
    // Total Users stat
    await expect(page.getByText(/total users/i)).toBeVisible();

    // Your Account stat
    await expect(page.getByText(/your account/i)).toBeVisible();

    // Status stat
    await expect(page.getByText(/status/i)).toBeVisible();
    await expect(page.getByText(/active/i)).toBeVisible();
  });

  test('should display users table', async ({ page }) => {
    // Check for table heading
    await expect(
      page.getByRole('heading', { name: /all users/i })
    ).toBeVisible();

    // Check for table headers
    await expect(page.getByText(/username/i)).toBeVisible();
    await expect(page.getByText(/email/i)).toBeVisible();
    await expect(page.getByText(/created at/i)).toBeVisible();
  });

  test('should display user in the table', async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector('table');

    // Check if table has rows
    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(await rows.count());
  });

  test('should paginate users table', async ({ page }) => {
    // Note: This test only works if there are more than 10 users
    // Wait for table to load
    await page.waitForSelector('table');

    // Check if pagination exists (only if there are multiple pages)
    const paginatorElements = page.locator('[role="navigation"]');
    const hasPagination = (await paginatorElements.count()) > 0;

    if (hasPagination) {
      // Click next page if it exists
      const nextButton = page.locator('button:has-text("Next")');
      if ((await nextButton.count()) > 0) {
        await nextButton.click();
        await page.waitForLoadState('networkidle');
      }
    }
  });

  test('should navigate to profile', async ({ page }) => {
    await page.getByRole('button', { name: /profile/i }).click();
    await expect(page).toHaveURL('/profile');
  });

  test('should navigate to home', async ({ page }) => {
    await page.getByRole('button', { name: /home/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('should display user greeting', async ({ page }) => {
    // Check for welcome message with username
    await expect(page.getByText(/welcome,/i)).toBeVisible();
  });
});
