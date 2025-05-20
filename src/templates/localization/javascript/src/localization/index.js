import React, { createContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules, Platform } from 'react-native';

// Import translations
import en from './translations/en.json';
import es from './translations/es.json';

const LANGUAGE_STORAGE_KEY = '@app_language';

// Initialize i18n
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Create context
const LocalizationContext = createContext({
  t: (key) => key,
  locale: 'en',
  setLocale: () => {},
  availableLanguages: ['en', 'es'],
});

// Get device language
const getDeviceLanguage = () => {
  const deviceLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
      : NativeModules.I18nManager.localeIdentifier;

  return deviceLanguage.slice(0, 2); // Get first two characters (language code)
};

export const LocalizationProvider = ({ children }) => {
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState('en');
  const availableLanguages = ['en', 'es'];

  // Load saved language on mount
  useEffect(() => {
    loadLanguage();
  }, []);

  // Load language from storage or use device language
  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      
      if (savedLanguage) {
        changeLanguage(savedLanguage);
      } else {
        // Use device language if available, otherwise default to English
        const deviceLanguage = getDeviceLanguage();
        const supportedDeviceLanguage = availableLanguages.includes(deviceLanguage)
          ? deviceLanguage
          : 'en';
        
        changeLanguage(supportedDeviceLanguage);
        await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, supportedDeviceLanguage);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
      changeLanguage('en'); // Default to English on error
    }
  };

  // Change language
  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setLocale(language);
  };

  // Update storage when language changes
  const setLocaleWithStorage = async (language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
      changeLanguage(language);
    } catch (error) {
      console.error('Failed to save language setting:', error);
    }
  };

  return (
    <LocalizationContext.Provider
      value={{
        t,
        locale,
        setLocale: setLocaleWithStorage,
        availableLanguages,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

// Custom hook to use localization
export const useLocalization = () => React.useContext(LocalizationContext);

// Re-export useTranslation for convenience
export { useTranslation };

// Export i18n instance
export { i18n };
