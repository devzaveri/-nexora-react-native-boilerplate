import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
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
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setNetworkStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    updateAppSettings: (state, action) => {
      state.appSettings = {
        ...state.appSettings,
        ...action.payload
      };
    }
  }
});

export const { setLoading, setNetworkStatus, updateAppSettings } = appSlice.actions;

export default appSlice.reducer;
