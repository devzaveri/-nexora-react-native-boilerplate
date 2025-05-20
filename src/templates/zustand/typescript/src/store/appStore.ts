import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// App settings storage key
const APP_SETTINGS_KEY = '@app_settings';

// Define types
interface AppSettings {
  notificationsEnabled: boolean;
  analyticsEnabled: boolean;
  [key: string]: any;
}

interface AppState {
  isLoading: boolean;
  isConnected: boolean;
  appSettings: AppSettings;
  setLoading: (isLoading: boolean) => void;
  setNetworkStatus: (isConnected: boolean) => void;
  updateAppSettings: (newSettings: Partial<AppSettings>) => Promise<void>;
  loadAppSettings: () => Promise<void>;
  resetAppSettings: () => Promise<void>;
}

// Create app store
export const appStore = create<AppState>((set, get) => ({
  // State
  isLoading: false,
  isConnected: true,
  appSettings: {
    notificationsEnabled: true,
    analyticsEnabled: true,
    // Theme and language settings will be in their own stores
    // when those features are enabled
  },
  
  // Actions
  setLoading: (isLoading: boolean) => set({ isLoading }),
  
  setNetworkStatus: (isConnected: boolean) => set({ isConnected }),
  
  updateAppSettings: async (newSettings: Partial<AppSettings>) => {
    const updatedSettings = {
      ...get().appSettings,
      ...newSettings
    };
    
    // Save to persistent storage
    try {
      await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Failed to save app settings:', error);
    }
    
    set({ appSettings: updatedSettings });
  },
  
  // Load settings from storage
  loadAppSettings: async () => {
    try {
      const storedSettings = await AsyncStorage.getItem(APP_SETTINGS_KEY);
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings) as AppSettings;
        set({ appSettings: parsedSettings });
      }
    } catch (error) {
      console.error('Failed to load app settings:', error);
    }
  },
  
  // Reset to defaults
  resetAppSettings: async () => {
    const defaultSettings: AppSettings = {
      notificationsEnabled: true,
      analyticsEnabled: true,
    };
    
    try {
      await AsyncStorage.setItem(APP_SETTINGS_KEY, JSON.stringify(defaultSettings));
      set({ appSettings: defaultSettings });
    } catch (error) {
      console.error('Failed to reset app settings:', error);
    }
  }
}));
