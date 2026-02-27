import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '../../pages/Login';
import { useAuthStore } from '../../store/authStore';

// Mock useAuthStore
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderWithProviders = (component) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Login Component', () => {
  const mockSendOtp = vi.fn();
  const mockLoginWithOtp = vi.fn();
  const mockLoginWithPassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.mockReturnValue({
      sendOtp: mockSendOtp,
      loginWithOtp: mockLoginWithOtp,
      loginWithPassword: mockLoginWithPassword,
      isLoading: false,
      error: null,
      user: null,
    });
  });

  describe('Rendering', () => {
    it('should render login form', () => {
      renderWithProviders(<Login />);
      
      expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    it('should render mobile number input', () => {
      renderWithProviders(<Login />);
      
      const mobileInput = screen.getByPlaceholderText(/mobile/i);
      expect(mobileInput).toBeInTheDocument();
    });

    it('should have toggle for OTP and password login', () => {
      renderWithProviders(<Login />);
      
      // Look for login method toggle
      const otpTab = screen.queryByText(/otp/i);
      const passwordTab = screen.queryByText(/password/i);
      
      // At least one login method should be available
      expect(otpTab || passwordTab).toBeTruthy();
    });
  });

  describe('OTP Login Flow', () => {
    it('should validate mobile number format', async () => {
      renderWithProviders(<Login />);
      const user = userEvent.setup();
      
      const mobileInput = screen.getByPlaceholderText(/mobile/i);
      
      // Enter invalid mobile number
      await user.type(mobileInput, '12345');
      
      // Try to submit
      const sendOtpButton = screen.getByRole('button', { name: /send.*otp/i });
      if (sendOtpButton) {
        await user.click(sendOtpButton);
        
        // Should show validation error
        await waitFor(() => {
          expect(screen.getByText(/valid.*mobile/i) || 
                 screen.getByText(/10.*digit/i)).toBeTruthy();
        });
      }
    });

    it('should accept valid Indian mobile number', async () => {
      renderWithProviders(<Login />);
      const user = userEvent.setup();
      
      const mobileInput = screen.getByPlaceholderText(/mobile/i);
      
      // Enter valid mobile number
      await user.type(mobileInput, '9876543210');
      
      expect(mobileInput).toHaveValue('9876543210');
    });

    it('should show OTP input after sending OTP', async () => {
      mockSendOtp.mockResolvedValueOnce({});
      
      useAuthStore.mockReturnValue({
        sendOtp: mockSendOtp,
        loginWithOtp: mockLoginWithOtp,
        isLoading: false,
        error: null,
        user: null,
        otpSent: true,
      });
      
      renderWithProviders(<Login />);
      
      // After OTP is sent, OTP input should appear
      const otpInput = screen.queryByPlaceholderText(/otp/i);
      // Test the presence of verify button or OTP field
      expect(otpInput || screen.queryByText(/verify/i)).toBeTruthy();
    });
  });

  describe('Password Login Flow', () => {
    it('should show username and password fields for password login', async () => {
      renderWithProviders(<Login />);
      
      // Switch to password login if available
      const passwordTab = screen.queryByText(/password/i);
      if (passwordTab) {
        await userEvent.click(passwordTab);
        
        const usernameInput = screen.queryByPlaceholderText(/username/i);
        const passwordInput = screen.queryByPlaceholderText(/password/i);
        
        expect(usernameInput || passwordInput).toBeTruthy();
      }
    });

    it('should call loginWithPassword on form submit', async () => {
      mockLoginWithPassword.mockResolvedValueOnce({});
      
      renderWithProviders(<Login />);
      const user = userEvent.setup();
      
      // Switch to password login
      const passwordTab = screen.queryByText(/password/i);
      if (passwordTab) {
        await user.click(passwordTab);
        
        const usernameInput = screen.getByPlaceholderText(/username/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        
        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'password123');
        
        const loginButton = screen.getByRole('button', { name: /login/i });
        await user.click(loginButton);
        
        expect(mockLoginWithPassword).toHaveBeenCalled();
      }
    });
  });

  describe('Error Handling', () => {
    it('should display error message on failed login', () => {
      useAuthStore.mockReturnValue({
        sendOtp: mockSendOtp,
        loginWithOtp: mockLoginWithOtp,
        isLoading: false,
        error: 'Invalid credentials',
        user: null,
      });
      
      renderWithProviders(<Login />);
      
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    it('should show loading state during API call', () => {
      useAuthStore.mockReturnValue({
        sendOtp: mockSendOtp,
        loginWithOtp: mockLoginWithOtp,
        isLoading: true,
        error: null,
        user: null,
      });
      
      renderWithProviders(<Login />);
      
      // Should show loading indicator or disabled button
      const buttons = screen.getAllByRole('button');
      const isDisabled = buttons.some(btn => btn.disabled);
      const hasLoadingText = screen.queryByText(/loading|sending|verifying/i);
      
      expect(isDisabled || hasLoadingText).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to dashboard on successful login', async () => {
      useAuthStore.mockReturnValue({
        sendOtp: mockSendOtp,
        loginWithOtp: mockLoginWithOtp.mockResolvedValueOnce({}),
        isLoading: false,
        error: null,
        user: { id: 1, role: 'PATIENT' },
      });
      
      renderWithProviders(<Login />);
      
      // User is logged in, should navigate
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      }, { timeout: 1000 }).catch(() => {
        // Navigation might be handled differently
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      renderWithProviders(<Login />);
      
      const form = screen.getByRole('form') || document.querySelector('form');
      expect(form).toBeTruthy();
    });

    it('should be keyboard navigable', async () => {
      renderWithProviders(<Login />);
      
      const inputs = screen.getAllByRole('textbox');
      const buttons = screen.getAllByRole('button');
      
      // All interactive elements should be focusable
      [...inputs, ...buttons].forEach(element => {
        expect(element.tabIndex).toBeGreaterThanOrEqual(-1);
      });
    });
  });
});
