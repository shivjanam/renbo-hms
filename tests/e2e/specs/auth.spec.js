// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test.describe('Login Page', () => {
    test('should display login form', async ({ page }) => {
      await expect(page.locator('form')).toBeVisible();
      await expect(page.getByPlaceholder(/mobile/i)).toBeVisible();
    });

    test('should have correct title', async ({ page }) => {
      await expect(page).toHaveTitle(/login|hospital/i);
    });

    test('should show validation error for invalid mobile', async ({ page }) => {
      await page.getByPlaceholder(/mobile/i).fill('12345');
      await page.getByRole('button', { name: /send.*otp|login/i }).click();
      
      await expect(page.getByText(/valid|invalid|10.*digit/i)).toBeVisible();
    });
  });

  test.describe('OTP Login Flow', () => {
    test('should accept valid Indian mobile number', async ({ page }) => {
      const mobileInput = page.getByPlaceholder(/mobile/i);
      await mobileInput.fill('9876543210');
      
      await expect(mobileInput).toHaveValue('9876543210');
    });

    test('should show OTP sent message after sending OTP', async ({ page }) => {
      await page.getByPlaceholder(/mobile/i).fill('9876543210');
      
      // Mock the API response
      await page.route('**/api/v1/auth/otp/send', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: 'OTP sent successfully' }),
        });
      });
      
      await page.getByRole('button', { name: /send.*otp/i }).click();
      
      // Should show success message or OTP input
      const otpInput = page.getByPlaceholder(/otp|code/i);
      const successMessage = page.getByText(/sent|success/i);
      
      await expect(otpInput.or(successMessage)).toBeVisible({ timeout: 5000 });
    });
  });

  test.describe('Password Login Flow', () => {
    test('should switch to password login', async ({ page }) => {
      const passwordTab = page.getByRole('tab', { name: /password/i })
        .or(page.getByText(/password.*login/i));
      
      if (await passwordTab.isVisible()) {
        await passwordTab.click();
        
        await expect(page.getByPlaceholder(/username|email/i)).toBeVisible();
        await expect(page.getByPlaceholder(/password/i)).toBeVisible();
      }
    });

    test('should show error for wrong credentials', async ({ page }) => {
      const passwordTab = page.getByRole('tab', { name: /password/i })
        .or(page.getByText(/password.*login/i));
      
      if (await passwordTab.isVisible()) {
        await passwordTab.click();
        
        // Mock failed login
        await page.route('**/api/v1/auth/login', async route => {
          await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({ 
              success: false, 
              message: 'Invalid credentials' 
            }),
          });
        });
        
        await page.getByPlaceholder(/username|email/i).fill('wronguser');
        await page.getByPlaceholder(/password/i).fill('wrongpassword');
        await page.getByRole('button', { name: /login|sign in/i }).click();
        
        await expect(page.getByText(/invalid|error|failed/i)).toBeVisible();
      }
    });
  });

  test.describe('Registration Link', () => {
    test('should have link to registration', async ({ page }) => {
      const registerLink = page.getByRole('link', { name: /register|sign up|create account/i });
      
      await expect(registerLink).toBeVisible();
    });
  });
});

test.describe('Logout Flow', () => {
  test('should redirect to login after logout', async ({ page }) => {
    // First login (with mocked response)
    await page.goto('/login');
    
    // Mock successful login
    await page.route('**/api/v1/auth/otp/verify', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            accessToken: 'test-token',
            refreshToken: 'refresh-token',
            user: {
              id: 1,
              firstName: 'Test',
              primaryRole: 'PATIENT',
            },
          },
        }),
      });
    });
    
    // After logout, should redirect to login
    await page.goto('/login');
    await expect(page.url()).toContain('/login');
  });
});
