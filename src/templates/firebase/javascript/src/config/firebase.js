// Firebase configuration file
import { Platform } from 'react-native';
import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

/**
 * Initialize Firebase
 * Note: React Native Firebase automatically uses the google-services.json and GoogleService-Info.plist
 * files to configure the app.
 */
const initializeFirebase = () => {
  // Firebase is initialized automatically, but you can perform additional setup here
  
  // Enable Firestore persistence for offline access
  firestore().settings({
    persistence: true,
  });

  // Configure analytics collection
  analytics().setAnalyticsCollectionEnabled(true);

  // Configure crashlytics collection
  crashlytics().setCrashlyticsCollectionEnabled(true);

  // Configure Firebase background message handler
  if (Platform.OS === 'ios') {
    // Additional iOS configuration if needed
    messaging().setAutoInitEnabled(true);
  }

  // Handle background messages
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    // Process background messages here
    console.log('Message handled in the background!', remoteMessage);
  });
};

export default initializeFirebase;
