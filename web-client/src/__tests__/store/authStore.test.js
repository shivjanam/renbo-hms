import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

// Mock the API
vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have null user initially', () => {
      const { user } = useAuthStore.getState();
      expect(user).toBeNull();
    });

    it('should have null tokens initially', () => {
      const { accessToken, refreshToken } = useAuthStore.getState();
      expect(accessToken).toBeNull();
      expect(refreshToken).toBeNull();
    });

    it('should not be loading initially', () => {
      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe('Send OTP', () => {
    it('should call API with mobile number', async () => {
      api.post.mockResolvedValueOnce({ data: { success: true } });

      const { sendOtp } = useAuthStore.getState();
      await sendOtp('9876543210');

      expect(api.post).toHaveBeenCalledWith('/auth/otp/send', {
        mobileNumber: '9876543210',
      });
    });

    it('should set loading state during API call', async () => {
      let loadingDuringCall = false;
      
      api.post.mockImplementation(() => {
        loadingDuringCall = useAuthStore.getState().isLoading;
        return Promise.resolve({ data: { success: true } });
      });

      const { sendOtp } = useAuthStore.getState();
      await sendOtp('9876543210');

      expect(loadingDuringCall).toBe(true);
    });

    it('should handle API error', async () => {
      api.post.mockRejectedValueOnce(new Error('Network error'));

      const { sendOtp } = useAuthStore.getState();
      
      await expect(sendOtp('9876543210')).rejects.toThrow();
      
      const { error } = useAuthStore.getState();
      expect(error).toBeTruthy();
    });
  });

  describe('Login with OTP', () => {
    const mockAuthResponse = {
      data: {
        success: true,
        data: {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          user: {
            id: 1,
            firstName: 'Test',
            lastName: 'User',
            mobileNumber: '9876543210',
            primaryRole: 'PATIENT',
          },
        },
      },
    };

    it('should store tokens on successful login', async () => {
      api.post.mockResolvedValueOnce(mockAuthResponse);

      const { loginWithOtp } = useAuthStore.getState();
      await loginWithOtp('9876543210', '123456');

      const { accessToken, refreshToken, user } = useAuthStore.getState();
      
      expect(accessToken).toBe('test-access-token');
      expect(refreshToken).toBe('test-refresh-token');
      expect(user.id).toBe(1);
    });

    it('should set user data on successful login', async () => {
      api.post.mockResolvedValueOnce(mockAuthResponse);

      const { loginWithOtp } = useAuthStore.getState();
      await loginWithOtp('9876543210', '123456');

      const { user } = useAuthStore.getState();
      
      expect(user.firstName).toBe('Test');
      expect(user.primaryRole).toBe('PATIENT');
    });

    it('should call API with correct payload', async () => {
      api.post.mockResolvedValueOnce(mockAuthResponse);

      const { loginWithOtp } = useAuthStore.getState();
      await loginWithOtp('9876543210', '123456');

      expect(api.post).toHaveBeenCalledWith('/auth/otp/verify', {
        mobileNumber: '9876543210',
        otp: '123456',
      });
    });
  });

  describe('Login with Password', () => {
    const mockAuthResponse = {
      data: {
        success: true,
        data: {
          accessToken: 'test-access-token',
          refreshToken: 'test-refresh-token',
          user: {
            id: 2,
            username: 'admin',
            primaryRole: 'HOSPITAL_ADMIN',
          },
        },
      },
    };

    it('should store tokens on successful login', async () => {
      api.post.mockResolvedValueOnce(mockAuthResponse);

      const { loginWithPassword } = useAuthStore.getState();
      await loginWithPassword('admin', 'password123');

      const { accessToken, user } = useAuthStore.getState();
      
      expect(accessToken).toBe('test-access-token');
      expect(user.primaryRole).toBe('HOSPITAL_ADMIN');
    });

    it('should call API with correct payload', async () => {
      api.post.mockResolvedValueOnce(mockAuthResponse);

      const { loginWithPassword } = useAuthStore.getState();
      await loginWithPassword('admin', 'password123');

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        username: 'admin',
        password: 'password123',
      });
    });
  });

  describe('Logout', () => {
    it('should clear all auth state on logout', async () => {
      // First, set some state
      useAuthStore.setState({
        user: { id: 1 },
        accessToken: 'token',
        refreshToken: 'refresh',
      });

      api.post.mockResolvedValueOnce({ data: { success: true } });

      const { logout } = useAuthStore.getState();
      await logout();

      const { user, accessToken, refreshToken } = useAuthStore.getState();
      
      expect(user).toBeNull();
      expect(accessToken).toBeNull();
      expect(refreshToken).toBeNull();
    });
  });

  describe('Token Refresh', () => {
    it('should update access token on refresh', async () => {
      useAuthStore.setState({
        refreshToken: 'old-refresh-token',
      });

      api.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            accessToken: 'new-access-token',
            refreshToken: 'new-refresh-token',
          },
        },
      });

      const { refreshAccessToken } = useAuthStore.getState();
      await refreshAccessToken();

      const { accessToken } = useAuthStore.getState();
      expect(accessToken).toBe('new-access-token');
    });
  });

  describe('Role Checks', () => {
    it('should correctly identify patient role', () => {
      useAuthStore.setState({
        user: { primaryRole: 'PATIENT' },
      });

      const { hasRole } = useAuthStore.getState();
      
      expect(hasRole('PATIENT')).toBe(true);
      expect(hasRole('DOCTOR')).toBe(false);
    });

    it('should correctly identify admin role', () => {
      useAuthStore.setState({
        user: { primaryRole: 'HOSPITAL_ADMIN' },
      });

      const { hasRole } = useAuthStore.getState();
      
      expect(hasRole('HOSPITAL_ADMIN')).toBe(true);
      expect(hasRole('PATIENT')).toBe(false);
    });
  });

  describe('Persistence', () => {
    it('should have persist middleware configured', () => {
      // The store should have persist functionality
      const store = useAuthStore;
      
      // Check if persist is configured
      expect(typeof store.persist).toBe('object');
    });
  });
});
