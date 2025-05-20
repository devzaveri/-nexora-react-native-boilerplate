import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '../../config/constants';
import { store } from '../../store';
import { RootState } from '../../store';

// Create Axios instance with default config
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token
axiosInstance.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    // Get token from store
    const state = store.getState() as RootState;
    const token = state.auth.token;
    
    // If token exists, add to headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError & { config: { _retry?: boolean } }): Promise<AxiosError> => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized error (token expired)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // You could implement token refresh logic here
      // For now, we'll just handle the error
      
      // If token refresh fails, redirect to login
      // store.dispatch(logout());
    }
    
    return Promise.reject(error);
  }
);

// API service interface
interface ApiService {
  get<T>(url: string, params?: Record<string, any>): Promise<T>;
  post<T>(url: string, data?: Record<string, any>): Promise<T>;
  put<T>(url: string, data?: Record<string, any>): Promise<T>;
  delete<T>(url: string): Promise<T>;
}

// Create a service wrapper for consistent API calls
export const apiService: ApiService = {
  get: async <T>(url: string, params = {}): Promise<T> => {
    try {
      const response = await axiosInstance.get<T>(url, { params });
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  post: async <T>(url: string, data = {}): Promise<T> => {
    try {
      const response = await axiosInstance.post<T>(url, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  put: async <T>(url: string, data = {}): Promise<T> => {
    try {
      const response = await axiosInstance.put<T>(url, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
  
  delete: async <T>(url: string): Promise<T> => {
    try {
      const response = await axiosInstance.delete<T>(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  },
};

// RTK Query API definition
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get auth token from state
      const token = (getState() as RootState).auth.token;
      
      // If token exists, add authorization header
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Define API endpoints here, for example:
    // getUsers: builder.query<User[], void>({
    //   query: () => 'users',
    // }),
  }),
});

// Error handling helper
const handleApiError = (error: any): void => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
  } else {
    // Not an Axios error
    console.error('Unexpected error:', error);
  }
};

export default apiService;
