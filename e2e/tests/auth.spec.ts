import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display home page', async ({ page }) => {
    await expect(page).toHaveTitle(/Finance Tracker|My App/);
    await expect(
      page.getByRole('heading', { name: /Welcome to Your App/i })
    ).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.getByRole('button', { name: /login/i }).click();
    await expect(page).toHaveURL('/login');
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.getByRole('button', { name: /register/i }).click();
    await expect(page).toHaveURL('/register');
    await expect(
      page.getByRole('heading', { name: /register/i })
    ).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('Test1234');
    await page.getByRole('button', { name: /login/i }).click();

    // Should see validation error
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });

  test('should show error for wrong credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill('nonexistent@example.com');
    await page.getByLabel(/password/i).fill('WrongPassword1');
    await page.getByRole('button', { name: /login/i }).click();

    // Should show error message
    await expect(
      page.getByText(/invalid email or password/i)
    ).toBeVisible();
  });

  test('should register new user successfully', async ({ page }) => {
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testUsername = `testuser${timestamp}`;

    await page.goto('/register');

    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/username/i).fill(testUsername);
    await page.getByLabel(/password/i).fill('Test1234');
    await page.getByRole('button', { name: /register/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(
      page.getByRole('heading', { name: /dashboard/i })
    ).toBeVisible();
  });

  test('should login and logout successfully', async ({ page }) => {
    // First, register a user
    const timestamp = Date.now();
    const testEmail = `test${timestamp}@example.com`;
    const testUsername = `testuser${timestamp}`;
    const testPassword = 'Test1234';

    await page.goto('/register');
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/username/i).fill(testUsername);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /register/i }).click();

    // Should be logged in and on dashboard
    await expect(page).toHaveURL('/dashboard');

    // Logout
    await page.getByRole('button', { name: /logout/i }).click();

    // Should redirect to home
    await expect(page).toHaveURL('/');

    // Login again
    await page.getByRole('button', { name: /login/i }).click();
    await page.getByLabel(/email/i).fill(testEmail);
    await page.getByLabel(/password/i).fill(testPassword);
    await page.getByRole('button', { name: /login/i }).click();

    // Should be back on dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(testUsername)).toBeVisible();
  });

  test('should protect dashboard route', async ({ page }) => {
    await page.goto('/dashboard');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should protect profile route', async ({ page }) => {
    await page.goto('/profile');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});
