import { create } from 'zustand';
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
  checkAuthStatus: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create auth store
export const authStore = create<AuthState>((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  // Actions
  checkAuthStatus: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      
      if (!token) {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
        return;
      }
      
      {{#if firebase}}
      // When using Firebase, we can rely on the onAuthStateChanged listener
      // but for consistency, we include this action
      const currentUser = auth().currentUser;
      
      if (!currentUser) {
        await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        });
        return;
      }
      
      // Fetch user data from Firestore
      const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
      const userData = userDoc.data() as Record<string, any>;
      
      set({
        user: { uid: currentUser.uid, ...userData },
        token,
        isAuthenticated: true,
        isLoading: false
      });
      {{else}}
      // Implement your auth validation logic here
      // This could validate the JWT token or make an API call to validate session
      
      // For now, let's assume the token is valid if it exists
      // In a real app, you'd want to validate the token and fetch user data
      set({
        user: { id: 'user-id', name: 'User Name' },
        token,
        isAuthenticated: true,
        isLoading: false
      });
      {{/if}}
    } catch (error: any) {
      console.error('Auth check failed:', error);
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Authentication check failed'
      });
    }
  },
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
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
      
      set({
        user: { uid: userCredential.user.uid, ...userData },
        token,
        isAuthenticated: true,
        isLoading: false
      });
      {{else}}
      // Implement your login logic here
      // This would typically make an API call to your auth endpoint
      
      // For now, return mock data
      const token = 'mock-jwt-token';
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      
      set({
        user: { id: 'user-id', email },
        token,
        isAuthenticated: true,
        isLoading: false
      });
      {{/if}}
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Login failed'
      });
    }
  },
  
  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    
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
      
      set({
        user: {
          uid: userCredential.user.uid,
          name,
          email
        },
        token,
        isAuthenticated: true,
        isLoading: false
      });
      {{else}}
      // Implement your registration logic here
      // This would typically make an API call to your auth endpoint
      
      // For now, return mock data
      const token = 'mock-jwt-token';
      await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
      
      set({
        user: { id: 'user-id', name, email },
        token,
        isAuthenticated: true,
        isLoading: false
      });
      {{/if}}
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Registration failed'
      });
    }
  },
  
  logout: async () => {
    try {
      {{#if firebase}}
      // Firebase sign out
      await auth().signOut();
      {{/if}}
      
      // Clear stored token
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      
      set({
        user: null,
        token: null,
        isAuthenticated: false
      });
    } catch (error: any) {
      console.error('Logout failed:', error);
      set({ error: error.message || 'Logout failed' });
    }
  },
  
  clearError: () => set({ error: null })
}));
