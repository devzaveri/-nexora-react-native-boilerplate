import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// App settings storage key
const APP_SETTINGS_KEY = '@app_settings';

// Create app store
export const appStore = create((set, get) => ({
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
  setLoading: (isLoading) => set({ isLoading }),
  
  setNetworkStatus: (isConnected) => set({ isConnected }),
  
  updateAppSettings: async (newSettings) => {
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
        const parsedSettings = JSON.parse(storedSettings);
        set({ appSettings: parsedSettings });
      }
    } catch (error) {
      console.error('Failed to load app settings:', error);
    }
  },
  
  // Reset to defaults
  resetAppSettings: async () => {
    const defaultSettings = {
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
