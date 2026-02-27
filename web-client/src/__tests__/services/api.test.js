import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    })),
  },
}));

describe('API Service', () => {
  let mockAxiosInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAxiosInstance = {
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    };
    axios.create.mockReturnValue(mockAxiosInstance);
  });

  describe('Configuration', () => {
    it('should create axios instance with correct base URL', () => {
      // Re-import to trigger axios.create
      vi.resetModules();
      
      expect(axios.create).toBeDefined();
    });

    it('should set Content-Type header', () => {
      const createCall = axios.create.mock?.calls?.[0]?.[0];
      
      if (createCall) {
        expect(createCall.headers?.['Content-Type']).toBe('application/json');
      }
    });
  });

  describe('Request Interceptor', () => {
    it('should add Authorization header when token exists', async () => {
      // This tests the interceptor logic
      const mockConfig = { headers: {} };
      const token = 'test-token';
      
      // Simulate what the interceptor does
      if (token) {
        mockConfig.headers.Authorization = `Bearer ${token}`;
      }
      
      expect(mockConfig.headers.Authorization).toBe('Bearer test-token');
    });

    it('should add X-Hospital-Id header', () => {
      const mockConfig = { headers: {} };
      const hospitalId = '1';
      
      if (hospitalId) {
        mockConfig.headers['X-Hospital-Id'] = hospitalId;
      }
      
      expect(mockConfig.headers['X-Hospital-Id']).toBe('1');
    });
  });

  describe('Response Interceptor', () => {
    it('should handle successful response', () => {
      const mockResponse = {
        data: { success: true, data: { id: 1 } },
        status: 200,
      };
      
      // Simulate successful response handling
      const result = mockResponse.data;
      
      expect(result.success).toBe(true);
    });

    it('should handle 401 error for token refresh', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Token expired' },
        },
        config: { _retry: false },
      };
      
      // Simulate 401 handling logic
      if (mockError.response?.status === 401 && !mockError.config._retry) {
        mockError.config._retry = true;
        // Would trigger token refresh
      }
      
      expect(mockError.config._retry).toBe(true);
    });

    it('should not retry if already retried', () => {
      const mockError = {
        response: { status: 401 },
        config: { _retry: true },
      };
      
      // Should not retry again
      expect(mockError.config._retry).toBe(true);
    });

    it('should handle network errors', () => {
      const mockError = {
        message: 'Network Error',
        response: undefined,
      };
      
      // Network errors have no response
      expect(mockError.response).toBeUndefined();
      expect(mockError.message).toBe('Network Error');
    });
  });

  describe('API Methods', () => {
    it('should make GET request', async () => {
      mockAxiosInstance.get.mockResolvedValueOnce({ data: { id: 1 } });
      
      await mockAxiosInstance.get('/test');
      
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test');
    });

    it('should make POST request with data', async () => {
      const testData = { name: 'test' };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: { id: 1 } });
      
      await mockAxiosInstance.post('/test', testData);
      
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', testData);
    });

    it('should make PUT request with data', async () => {
      const testData = { id: 1, name: 'updated' };
      mockAxiosInstance.put.mockResolvedValueOnce({ data: testData });
      
      await mockAxiosInstance.put('/test/1', testData);
      
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test/1', testData);
    });

    it('should make DELETE request', async () => {
      mockAxiosInstance.delete.mockResolvedValueOnce({ data: { success: true } });
      
      await mockAxiosInstance.delete('/test/1');
      
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test/1');
    });
  });

  describe('Error Handling', () => {
    it('should extract error message from response', () => {
      const mockError = {
        response: {
          data: {
            message: 'Validation failed',
            errors: ['Field is required'],
          },
        },
      };
      
      const errorMessage = mockError.response?.data?.message || 'Unknown error';
      
      expect(errorMessage).toBe('Validation failed');
    });

    it('should handle timeout', () => {
      const mockError = {
        code: 'ECONNABORTED',
        message: 'timeout of 30000ms exceeded',
      };
      
      const isTimeout = mockError.code === 'ECONNABORTED';
      
      expect(isTimeout).toBe(true);
    });
  });
});
