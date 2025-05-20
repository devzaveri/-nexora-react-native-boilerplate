import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

// Initial state
const initialState: AppState = {
  isLoading: false,
  isConnected: true,
  appSettings: {
    notificationsEnabled: true,
    analyticsEnabled: true,
  }
};

// App slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setNetworkStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    updateAppSettings: (state, action: PayloadAction<Partial<AppSettings>>) => {
      state.appSettings = {
        ...state.appSettings,
        ...action.payload
      };
    }
  }
});

export const { setLoading, setNetworkStatus, updateAppSettings } = appSlice.actions;

export default appSlice.reducer;
