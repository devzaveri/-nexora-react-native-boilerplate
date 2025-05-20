import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
{{#if firebase}}
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
{{/if}}

const AUTH_TOKEN_KEY = '@auth_token';

// Define types
interface User {
  uid?: string;
  id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

interface AuthPayload {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

// Async actions
export const checkAuthStatus = createAsyncThunk<AuthPayload, void>(
  'auth/checkStatus',
  async () => {
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      
      if (!token) {
        return { user: null, token: null, isAuthenticated: false };
      }
      
      {{#if firebase}}
      // When using Firebase, we can rely on the onAuthStateChanged listener
      // but for consistency, we include this action
      const currentUser = auth().currentUser;
      
      if (!currentUser) {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        return { user: null, token: null, isAuthenticated: false };
      }
      
      // Fetch user data from Firestore
      const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
      const userData = userDoc.data() as Record<string, any>;
      
      return {
        user: { uid: currentUser.uid, ...userData },
        token,
        isAuthenticated: true
      };
      {{else}}
      // Implement your auth validation logic here
      // This could validate the JWT token or make an API call to validate session
      
      // For now, let's assume the token is valid if it exists
      // In a real app, you'd want to validate the token and fetch user data
      return {
        user: { id: 'user-id', name: 'User Name' },
        token,
        isAuthenticated: true
      };
      {{/if}}
    } catch (error) {
      console.error('Auth check failed:', error);
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      return { user: null, token: null, isAuthenticated: false };
    }
  }
);

export const login = createAsyncThunk<AuthPayload, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      {{#if firebase}}
      // Firebase authentication
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      
      // Get user token
      const token = await userCredential.user.getIdToken();
      
      // Store token
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      
      // Fetch user data from Firestore
      const userDoc = await firestore().collection('users').doc(userCredential.user.uid).get();
      const userData = userDoc.data() as Record<string, any>;
      
      return {
        user: { uid: userCredential.user.uid, ...userData },
        token,
        isAuthenticated: true
      };
      {{else}}
      // Implement your login logic here
      // This would typically make an API call to your auth endpoint
      
      // For now, return mock data
      const token = 'mock-jwt-token';
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      
      return {
        user: { id: 'user-id', email },
        token,
        isAuthenticated: true
      };
      {{/if}}
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk<AuthPayload, RegisterCredentials, { rejectValue: string }>(
  'auth/register',
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      {{#if firebase}}
      // Firebase authentication
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      
      // Get user token
      const token = await userCredential.user.getIdToken();
      
      // Store token
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      
      // Update user profile
      await userCredential.user.updateProfile({
        displayName: name
      });
      
      // Store additional user data in Firestore
      await firestore().collection('users').doc(userCredential.user.uid).set({
        name,
        email,
        createdAt: firestore.FieldValue.serverTimestamp()
      });
      
      return {
        user: {
          uid: userCredential.user.uid,
          name,
          email
        },
        token,
        isAuthenticated: true
      };
      {{else}}
      // Implement your registration logic here
      // This would typically make an API call to your auth endpoint
      
      // For now, return mock data
      const token = 'mock-jwt-token';
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      
      return {
        user: { id: 'user-id', name, email },
        token,
        isAuthenticated: true
      };
      {{/if}}
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk<{ success: boolean }, void>(
  'auth/logout',
  async () => {
    try {
      {{#if firebase}}
      // Firebase sign out
      await auth().signOut();
      {{/if}}
      
      // Clear stored token
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false };
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check auth status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = action.payload.isAuthenticated;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.error.message || 'Authentication check failed';
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
      })
      
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Registration failed';
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;
