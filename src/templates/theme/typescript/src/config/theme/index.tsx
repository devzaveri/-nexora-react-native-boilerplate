import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, ThemeColors } from './themes';

const THEME_STORAGE_KEY = '@theme_mode';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  deviceTheme: string | null;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightTheme,
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const deviceTheme = useColorScheme();
  const [themeState, setThemeState] = useState<ThemeState>({
    mode: 'light',
    isDark: false,
    colors: lightTheme,
    deviceTheme,
  });

  // Load saved theme on mount
  useEffect(() => {
    loadTheme();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (themeState.mode === 'system') {
      handleSystemThemeChange(deviceTheme);
    }
  }, [deviceTheme]);

  // Load theme from storage
  const loadTheme = async (): Promise<void> => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        const mode = savedTheme as ThemeMode;
        if (mode === 'system') {
          handleSystemThemeChange(deviceTheme);
        } else {
          setThemeState({
            mode,
            isDark: mode === 'dark',
            colors: mode === 'dark' ? darkTheme : lightTheme,
            deviceTheme,
          });
        }
      } else {
        // Default to system theme if no saved preference
        handleSystemThemeChange(deviceTheme);
        await AsyncStorage.setItem(THEME_STORAGE_KEY, 'system');
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  // Handle system theme changes
  const handleSystemThemeChange = (theme: string | null): void => {
    const isDarkMode = theme === 'dark';
    setThemeState({
      mode: 'system',
      isDark: isDarkMode,
      colors: isDarkMode ? darkTheme : lightTheme,
      deviceTheme,
    });
  };

  // Set theme explicitly
  const setTheme = async (mode: ThemeMode): Promise<void> => {
    try {
      if (mode === 'system') {
        handleSystemThemeChange(deviceTheme);
      } else {
        const isDark = mode === 'dark';
        setThemeState({
          mode,
          isDark,
          colors: isDark ? darkTheme : lightTheme,
          deviceTheme,
        });
      }
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  };

  // Toggle between light and dark
  const toggleTheme = async (): Promise<void> => {
    try {
      const newMode = themeState.isDark ? 'light' : 'dark';
      setThemeState({
        mode: newMode,
        isDark: !themeState.isDark,
        colors: themeState.isDark ? lightTheme : darkTheme,
        deviceTheme,
      });
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch (error) {
      console.error('Failed to toggle theme:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark: themeState.isDark,
        colors: themeState.colors,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => useContext(ThemeContext);
