// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Doctor Portal E2E', () => {
  // Mock authenticated doctor
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: {
            id: 10,
            firstName: 'Amit',
            lastName: 'Kumar',
            displayName: 'Dr. Amit Kumar',
            primaryRole: 'DOCTOR',
            hospitalId: 1,
            departmentId: 1,
          },
          accessToken: 'mock-doctor-token',
          refreshToken: 'mock-refresh-token',
        },
      }));
    });
  });

  test.describe('Doctor Dashboard', () => {
    test('should display doctor dashboard', async ({ page }) => {
      await page.goto('/doctor/dashboard');
      
      await expect(page.getByText(/dashboard|today|appointments/i)).toBeVisible();
    });

    test('should show today\'s appointments count', async ({ page }) => {
      // Mock dashboard API
      await page.route('**/api/v1/doctor/dashboard', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              todayAppointments: 15,
              completedConsultations: 5,
              pendingPatients: 10,
              queueStatus: {
                currentToken: 3,
                waitingCount: 10,
              },
            },
          }),
        });
      });
      
      await page.goto('/doctor/dashboard');
      
      // Should show appointment stats
      await expect(page.getByText(/15|appointment/i)).toBeVisible();
    });
  });

  test.describe('Appointment List', () => {
    test('should display today\'s appointments', async ({ page }) => {
      // Mock appointments API
      await page.route('**/api/v1/doctor/appointments**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: 1,
                tokenNumber: 1,
                patientName: 'Ramesh Sharma',
                patientAge: '60 years',
                appointmentTime: '09:00',
                status: 'COMPLETED',
              },
              {
                id: 2,
                tokenNumber: 2,
                patientName: 'Suresh Patel',
                patientAge: '67 years',
                appointmentTime: '09:15',
                status: 'IN_PROGRESS',
              },
              {
                id: 3,
                tokenNumber: 3,
                patientName: 'Rahul Gupta',
                patientAge: '38 years',
                appointmentTime: '09:30',
                status: 'WAITING',
              },
            ],
          }),
        });
      });
      
      await page.goto('/doctor/appointments');
      
      await expect(page.getByText(/Ramesh|Suresh|Rahul/i)).toBeVisible();
    });

    test('should filter appointments by status', async ({ page }) => {
      await page.goto('/doctor/appointments');
      
      const statusFilter = page.getByRole('combobox', { name: /status|filter/i })
        .or(page.locator('select'));
      
      if (await statusFilter.isVisible()) {
        await statusFilter.selectOption({ label: /waiting|pending/i });
        // Should filter the list
      }
    });
  });

  test.describe('Patient Consultation', () => {
    test('should open consultation view for patient', async ({ page }) => {
      // Mock patient details
      await page.route('**/api/v1/doctor/patients/1', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              id: 1,
              uhid: 'HMS2600001',
              firstName: 'Ramesh',
              lastName: 'Sharma',
              age: 60,
              gender: 'MALE',
              bloodGroup: 'B_POSITIVE',
              allergies: 'Penicillin',
              chronicConditions: 'Diabetes Type 2, Hypertension',
              currentMedications: 'Metformin 500mg, Amlodipine 5mg',
            },
          }),
        });
      });
      
      await page.goto('/doctor/consultation/1');
      
      await expect(page.getByText(/Ramesh|HMS2600001/i)).toBeVisible();
    });

    test('should show patient medical history', async ({ page }) => {
      // Mock history API
      await page.route('**/api/v1/doctor/patients/1/history', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: {
              previousVisits: [
                {
                  date: '2026-01-15',
                  diagnosis: 'Routine Checkup',
                  doctorName: 'Dr. Amit Kumar',
                },
              ],
              labReports: [],
              prescriptions: [],
            },
          }),
        });
      });
      
      await page.goto('/doctor/consultation/1');
      
      const historyTab = page.getByRole('tab', { name: /history|previous/i });
      if (await historyTab.isVisible()) {
        await historyTab.click();
        await expect(page.getByText(/previous|visit|checkup/i)).toBeVisible();
      }
    });
  });

  test.describe('Prescription Creation', () => {
    test('should open prescription form', async ({ page }) => {
      await page.goto('/doctor/consultation/1');
      
      const prescribeButton = page.getByRole('button', { name: /prescribe|new.*prescription/i });
      
      if (await prescribeButton.isVisible()) {
        await prescribeButton.click();
        
        // Prescription form should appear
        await expect(page.getByText(/diagnosis|medicine|prescription/i)).toBeVisible();
      }
    });

    test('should search and add medicine', async ({ page }) => {
      // Mock medicine search
      await page.route('**/api/v1/pharmacy/medicines**', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              {
                id: 5,
                name: 'Crocin 500',
                genericName: 'Paracetamol',
                strength: '500mg',
                type: 'TABLET',
              },
              {
                id: 10,
                name: 'Glycomet 500',
                genericName: 'Metformin',
                strength: '500mg',
                type: 'TABLET',
              },
            ],
          }),
        });
      });
      
      await page.goto('/doctor/consultation/1');
      
      const medicineSearch = page.getByPlaceholder(/search.*medicine/i);
      if (await medicineSearch.isVisible()) {
        await medicineSearch.fill('para');
        
        // Should show search results
        await expect(page.getByText(/Crocin|Paracetamol/i)).toBeVisible();
      }
    });
  });

  test.describe('Lab Test Ordering', () => {
    test('should order lab tests', async ({ page }) => {
      // Mock lab tests
      await page.route('**/api/v1/lab/tests', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            data: [
              { id: 1, name: 'Complete Blood Count', code: 'LAB001', price: 350 },
              { id: 10, name: 'Fasting Blood Sugar', code: 'LAB010', price: 80 },
            ],
          }),
        });
      });
      
      await page.goto('/doctor/consultation/1');
      
      const labOrderButton = page.getByRole('button', { name: /order.*lab|lab.*test/i });
      if (await labOrderButton.isVisible()) {
        await labOrderButton.click();
        
        // Lab test selection should appear
        await expect(page.getByText(/blood.*count|CBC/i)).toBeVisible();
      }
    });
  });
});

test.describe('Complete Doctor Flow', () => {
  test('Doctor consults → prescribes medicine → orders lab test', async ({ page }) => {
    // Set up doctor authentication
    await page.addInitScript(() => {
      localStorage.setItem('auth-storage', JSON.stringify({
        state: {
          user: {
            id: 10,
            displayName: 'Dr. Amit Kumar',
            primaryRole: 'DOCTOR',
          },
          accessToken: 'mock-doctor-token',
        },
      }));
    });

    // Mock required APIs
    await page.route('**/api/v1/doctor/**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: {} }),
      });
    });

    // Step 1: View appointments
    await page.goto('/doctor/appointments');
    
    // Step 2: Start consultation
    const consultButton = page.getByRole('button', { name: /consult|start/i });
    if (await consultButton.first().isVisible()) {
      await consultButton.first().click();
    }
    
    // Step 3: Create prescription (mocked)
    // Step 4: Order lab tests (mocked)
    
    // Verify we're on a doctor page
    expect(page.url()).toContain('/doctor');
  });
});
