import { test, expect } from '@playwright/test';

test.describe('User Profile', () => {
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

    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Store credentials for later use
    await page.evaluate(
      ({ email, username, password }) => {
        (window as any).testUser = { email, username, password };
      },
      { email: testEmail, username: testUsername, password: testPassword }
    );
  });

  test('should navigate to profile page', async ({ page }) => {
    await page.getByRole('button', { name: /profile/i }).click();
    await expect(page).toHaveURL('/profile');
    await expect(
      page.getByRole('heading', { name: /profile settings/i })
    ).toBeVisible();
  });

  test('should display current user information', async ({ page }) => {
    await page.goto('/profile');

    const testUser = await page.evaluate(() => (window as any).testUser);

    // Check if email and username are pre-filled
    await expect(page.getByLabel(/email/i)).toHaveValue(testUser.email);
    await expect(page.getByLabel(/username/i)).toHaveValue(testUser.username);
  });

  test('should update username successfully', async ({ page }) => {
    await page.goto('/profile');

    const newUsername = `updated${Date.now()}`;

    await page.getByLabel(/username/i).fill(newUsername);
    await page.getByRole('button', { name: /update profile/i }).click();

    // Should see success message
    await expect(
      page.getByText(/profile updated successfully/i)
    ).toBeVisible();

    // Navigate to dashboard and verify new username
    await page.getByRole('button', { name: /dashboard/i }).click();
    await expect(page.getByText(newUsername)).toBeVisible();
  });

  test('should update email successfully', async ({ page }) => {
    await page.goto('/profile');

    const newEmail = `newemail${Date.now()}@example.com`;

    await page.getByLabel(/email/i).fill(newEmail);
    await page.getByRole('button', { name: /update profile/i }).click();

    // Should see success message
    await expect(
      page.getByText(/profile updated successfully/i)
    ).toBeVisible();
  });

  test('should update password successfully', async ({ page }) => {
    await page.goto('/profile');

    const newPassword = 'NewPass1234';

    // Fill in new password
    await page.getByLabel(/new password/i).fill(newPassword);
    await page.getByRole('button', { name: /update profile/i }).click();

    // Should see success message
    await expect(
      page.getByText(/profile updated successfully/i)
    ).toBeVisible();

    // Logout and login with new password
    await page.getByRole('button', { name: /logout/i }).click();

    const testUser = await page.evaluate(() => (window as any).testUser);

    await page.getByRole('button', { name: /login/i }).click();
    await page.getByLabel(/email/i).fill(testUser.email);
    await page.getByLabel(/password/i).fill(newPassword);
    await page.getByRole('button', { name: /login/i }).click();

    // Should be logged in
    await expect(page).toHaveURL('/dashboard');
  });

  test('should cancel profile update', async ({ page }) => {
    await page.goto('/profile');

    const testUser = await page.evaluate(() => (window as any).testUser);

    // Change username
    await page.getByLabel(/username/i).fill('changedusername');

    // Click cancel
    await page.getByRole('button', { name: /cancel/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');

    // Username should not be changed
    await expect(page.getByText(testUser.username)).toBeVisible();
  });

  test('should display account information', async ({ page }) => {
    await page.goto('/profile');

    // Should show account info card
    await expect(
      page.getByRole('heading', { name: /account information/i })
    ).toBeVisible();

    // Should display user ID
    await expect(page.getByText(/user id:/i)).toBeVisible();

    // Should display created at date
    await expect(page.getByText(/created at:/i)).toBeVisible();

    // Should display last updated date
    await expect(page.getByText(/last updated:/i)).toBeVisible();
  });
});
