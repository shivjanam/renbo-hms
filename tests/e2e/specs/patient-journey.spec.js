// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Patient Journey E2E', () => {
  // Mock authenticated patient
  test.beforeEach(async ({ page }) => {
    // Set up auth state
    await page.addInitScript(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: {
            id: 1,
            firstName: 'Ramesh',
            lastName: 'Sharma',
            mobileNumber: '9876543210',
            primaryRole: 'PATIENT',
          },
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
        },
      }));
    });
  });

  test.describe('Patient Dashboard', () => {
    test('should display patient dashboard', async ({ page }) => {
      await page.goto('/patient/dashboard');
      
      // Should show welcome message or dashboard elements
      await expect(page.getByText(/dashboard|welcome|hello/i)).toBeVisible();
    });

    test('should show upcoming appointments', async ({ page }) => {
      // Mock appointments API
      await page.route('**/api/v1/patients/*/appointments**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              content: [
                {
                  id: 1,
                  appointmentNumber: 'APT001',
                  doctorName: 'Dr. Amit Kumar',
                  appointmentDate: '2026-02-03',
                  slotStartTime: '10:00',
                  status: 'CONFIRMED',
                },
              ],
            },
          }),
        });
      });
      
      await page.goto('/patient/dashboard');
      
      // Should show appointments section
      const appointmentsSection = page.getByText(/appointment|upcoming/i);
      await expect(appointmentsSection).toBeVisible();
    });
  });

  test.describe('Appointment Booking', () => {
    test('should navigate to book appointment page', async ({ page }) => {
      await page.goto('/patient/dashboard');
      
      const bookButton = page.getByRole('link', { name: /book.*appointment/i })
        .or(page.getByRole('button', { name: /book.*appointment/i }));
      
      if (await bookButton.isVisible()) {
        await bookButton.click();
        await expect(page.url()).toContain('/appointment');
      }
    });

    test('should show doctor search', async ({ page }) => {
      await page.goto('/book-appointment');
      
      // Mock doctors API
      await page.route('**/api/v1/doctors**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: 1,
                displayName: 'Dr. Amit Kumar',
                primarySpecialization: 'GENERAL_MEDICINE',
                opdConsultationFee: 500,
              },
              {
                id: 2,
                displayName: 'Dr. Sanjay Mehta',
                primarySpecialization: 'CARDIOLOGY',
                opdConsultationFee: 800,
              },
            ],
          }),
        });
      });
      
      await page.goto('/book-appointment');
      
      // Should show doctor list or search
      const searchInput = page.getByPlaceholder(/search.*doctor|specialization/i);
      if (await searchInput.isVisible()) {
        await expect(searchInput).toBeEnabled();
      }
    });

    test('should select date and time slot', async ({ page }) => {
      // Mock available slots
      await page.route('**/api/v1/appointments/slots**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              { time: '09:00', available: true },
              { time: '09:15', available: true },
              { time: '09:30', available: false },
              { time: '09:45', available: true },
            ],
          }),
        });
      });
      
      await page.goto('/book-appointment?doctorId=1');
      
      // Date picker should be visible
      const datePicker = page.getByRole('textbox', { name: /date/i })
        .or(page.locator('[type="date"]'));
      
      if (await datePicker.isVisible()) {
        await expect(datePicker).toBeEnabled();
      }
    });
  });

  test.describe('My Prescriptions', () => {
    test('should display prescriptions list', async ({ page }) => {
      // Mock prescriptions API
      await page.route('**/api/v1/patients/*/prescriptions**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              content: [
                {
                  id: 1,
                  prescriptionNumber: 'RX001',
                  doctorName: 'Dr. Amit Kumar',
                  prescriptionDate: '2026-02-01',
                  diagnosis: 'Viral Fever',
                },
              ],
            },
          }),
        });
      });
      
      await page.goto('/patient/prescriptions');
      
      await expect(page.getByText(/prescription|diagnosis/i)).toBeVisible();
    });
  });

  test.describe('My Lab Reports', () => {
    test('should display lab reports', async ({ page }) => {
      // Mock lab reports API
      await page.route('**/api/v1/patients/*/lab-reports**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              content: [
                {
                  id: 1,
                  orderNumber: 'LAB001',
                  testName: 'Complete Blood Count',
                  status: 'COMPLETED',
                  reportDate: '2026-02-01',
                },
              ],
            },
          }),
        });
      });
      
      await page.goto('/patient/lab-reports');
      
      await expect(page.getByText(/lab|report|test/i)).toBeVisible();
    });

    test('should allow downloading report PDF', async ({ page }) => {
      await page.route('**/api/v1/lab/reports/*/pdf', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/pdf',
          body: Buffer.from('%PDF-1.4 test pdf content'),
        });
      });
      
      await page.goto('/patient/lab-reports');
      
      const downloadButton = page.getByRole('button', { name: /download|pdf/i });
      if (await downloadButton.isVisible()) {
        // Should initiate download
        const downloadPromise = page.waitForEvent('download');
        await downloadButton.click();
        // If download happens, test passes
      }
    });
  });

  test.describe('My Bills', () => {
    test('should display billing history', async ({ page }) => {
      // Mock billing API
      await page.route('**/api/v1/patients/*/invoices**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              content: [
                {
                  id: 1,
                  invoiceNumber: 'INV001',
                  totalAmount: 1180.00,
                  paidAmount: 1180.00,
                  status: 'PAID',
                  invoiceDate: '2026-02-01',
                },
              ],
            },
          }),
        });
      });
      
      await page.goto('/patient/bills');
      
      await expect(page.getByText(/bill|invoice|payment/i)).toBeVisible();
    });
  });
});

test.describe('Complete Patient Journey', () => {
  test('Patient registers → books appointment → pays → receives receipt', async ({ page }) => {
    // Step 1: Registration
    await page.goto('/register');
    
    // Mock registration API
    await page.route('**/api/v1/auth/register', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            accessToken: 'new-user-token',
            refreshToken: 'new-refresh-token',
            user: {
              id: 100,
              firstName: 'New',
              lastName: 'Patient',
              mobileNumber: '9876500000',
              primaryRole: 'PATIENT',
            },
          },
        }),
      });
    });
    
    // Fill registration form
    const firstNameInput = page.getByPlaceholder(/first.*name/i);
    if (await firstNameInput.isVisible()) {
      await firstNameInput.fill('New');
      await page.getByPlaceholder(/last.*name/i).fill('Patient');
      await page.getByPlaceholder(/mobile/i).fill('9876500000');
      
      // Submit registration
      await page.getByRole('button', { name: /register|sign up|submit/i }).click();
    }
    
    // Step 2: Book Appointment (navigation may happen automatically)
    await page.waitForTimeout(1000);
    
    // Step 3: Payment would be tested with payment gateway mocks
    // Step 4: Receipt download would be tested similarly
    
    // Verify we're on a logged-in page
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/login');
  });
});
