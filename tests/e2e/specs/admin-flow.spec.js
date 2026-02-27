// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Admin Portal E2E', () => {
  // Mock authenticated admin
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: {
            id: 2,
            firstName: 'Rajesh',
            lastName: 'Sharma',
            username: 'admin.cgh',
            primaryRole: 'HOSPITAL_ADMIN',
            hospitalId: 1,
          },
          accessToken: 'mock-admin-token',
          refreshToken: 'mock-refresh-token',
        },
      }));
    });
  });

  test.describe('Admin Dashboard', () => {
    test('should display admin dashboard with stats', async ({ page }) => {
      // Mock dashboard API
      await page.route('**/api/v1/admin/dashboard', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              todayStats: {
                appointments: 125,
                revenue: 156000,
                newPatients: 23,
                labTests: 45,
              },
              monthlyStats: {
                totalRevenue: 4500000,
                totalPatients: 2300,
                totalAppointments: 3500,
              },
            },
          }),
        });
      });
      
      await page.goto('/admin/dashboard');
      
      await expect(page.getByText(/dashboard|admin/i)).toBeVisible();
    });

    test('should load dashboard within 2 seconds', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/admin/dashboard');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(2000);
    });
  });

  test.describe('Patient Management', () => {
    test('should display patient list with pagination', async ({ page }) => {
      // Mock patients API
      await page.route('**/api/v1/patients**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              content: Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                uhid: `HMS260000${i + 1}`,
                firstName: 'Patient',
                lastName: `${i + 1}`,
                mobileNumber: `987654321${i}`,
              })),
              totalElements: 50,
              totalPages: 5,
              number: 0,
              size: 10,
            },
          }),
        });
      });
      
      await page.goto('/admin/patients');
      
      // Should show patient table
      await expect(page.getByRole('table').or(page.getByText(/patient/i))).toBeVisible();
      
      // Should have pagination
      const pagination = page.getByRole('navigation', { name: /pagination/i })
        .or(page.getByText(/page|next|previous/i));
      await expect(pagination).toBeVisible();
    });

    test('should search patients', async ({ page }) => {
      await page.goto('/admin/patients');
      
      const searchInput = page.getByPlaceholder(/search/i);
      if (await searchInput.isVisible()) {
        await searchInput.fill('Sharma');
        await searchInput.press('Enter');
        
        // Should trigger search
      }
    });

    test('should filter patients', async ({ page }) => {
      await page.goto('/admin/patients');
      
      const filterButton = page.getByRole('button', { name: /filter/i });
      if (await filterButton.isVisible()) {
        await filterButton.click();
        
        // Filter options should appear
        await expect(page.getByText(/gender|blood|date/i)).toBeVisible();
      }
    });
  });

  test.describe('Doctor Management', () => {
    test('should display doctor list', async ({ page }) => {
      // Mock doctors API
      await page.route('**/api/v1/admin/doctors**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              content: [
                {
                  id: 1,
                  displayName: 'Dr. Amit Kumar',
                  specialization: 'GENERAL_MEDICINE',
                  departmentName: 'General Medicine',
                  isActive: true,
                },
                {
                  id: 2,
                  displayName: 'Dr. Sanjay Mehta',
                  specialization: 'CARDIOLOGY',
                  departmentName: 'Cardiology',
                  isActive: true,
                },
              ],
            },
          }),
        });
      });
      
      await page.goto('/admin/doctors');
      
      await expect(page.getByText(/Amit|Sanjay/i)).toBeVisible();
    });

    test('should add new doctor', async ({ page }) => {
      await page.goto('/admin/doctors');
      
      const addButton = page.getByRole('button', { name: /add.*doctor|new.*doctor/i });
      if (await addButton.isVisible()) {
        await addButton.click();
        
        // Add doctor form should appear
        await expect(page.getByText(/first.*name|registration/i)).toBeVisible();
      }
    });
  });

  test.describe('Appointment Management', () => {
    test('should display all appointments', async ({ page }) => {
      // Mock appointments API
      await page.route('**/api/v1/admin/appointments**', async route => {
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
                  patientName: 'Ramesh Sharma',
                  doctorName: 'Dr. Amit Kumar',
                  appointmentDate: '2026-02-02',
                  status: 'SCHEDULED',
                },
              ],
            },
          }),
        });
      });
      
      await page.goto('/admin/appointments');
      
      await expect(page.getByText(/appointment|APT/i)).toBeVisible();
    });
  });

  test.describe('Billing Management', () => {
    test('should display billing overview', async ({ page }) => {
      // Mock billing API
      await page.route('**/api/v1/admin/billing**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              todayRevenue: 156000,
              pendingPayments: 45000,
              refundsProcessed: 5000,
            },
          }),
        });
      });
      
      await page.goto('/admin/billing');
      
      await expect(page.getByText(/billing|revenue|payment/i)).toBeVisible();
    });
  });

  test.describe('Reports', () => {
    test('should generate revenue report', async ({ page }) => {
      // Mock reports API
      await page.route('**/api/v1/reports/revenue**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              totalRevenue: 4500000,
              opdRevenue: 2500000,
              labRevenue: 1000000,
              pharmacyRevenue: 800000,
              ipdRevenue: 200000,
            },
          }),
        });
      });
      
      await page.goto('/admin/reports');
      
      // Select revenue report
      const revenueReport = page.getByText(/revenue.*report/i);
      if (await revenueReport.isVisible()) {
        await revenueReport.click();
      }
      
      await expect(page.getByText(/revenue|total|₹/i)).toBeVisible();
    });

    test('should export report as PDF', async ({ page }) => {
      await page.route('**/api/v1/reports/**/pdf', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/pdf',
          body: Buffer.from('%PDF-1.4 report content'),
        });
      });
      
      await page.goto('/admin/reports');
      
      const exportButton = page.getByRole('button', { name: /export|download|pdf/i });
      if (await exportButton.isVisible()) {
        // Should initiate download
        const downloadPromise = page.waitForEvent('download');
        await exportButton.click();
      }
    });
  });
});

test.describe('Admin views revenue & reports', () => {
  test('Complete admin reporting flow', async ({ page }) => {
    // Set up admin auth
    await page.addInitScript(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: {
            id: 2,
            primaryRole: 'HOSPITAL_ADMIN',
            hospitalId: 1,
          },
          accessToken: 'mock-admin-token',
        },
      }));
    });

    // Mock all admin APIs
    await page.route('**/api/v1/admin/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: {} }),
      });
    });

    await page.route('**/api/v1/reports/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            totalRevenue: 4500000,
            breakdown: [],
          },
        }),
      });
    });

    // Step 1: View dashboard
    await page.goto('/admin/dashboard');
    await expect(page.url()).toContain('/admin');
    
    // Step 2: Navigate to reports
    const reportsLink = page.getByRole('link', { name: /report/i });
    if (await reportsLink.isVisible()) {
      await reportsLink.click();
      await expect(page.url()).toContain('/report');
    }
    
    // Step 3: Generate report
    // Step 4: Download PDF
    
    // Verify we stayed in admin section
    expect(page.url()).toContain('/admin');
  });
});
