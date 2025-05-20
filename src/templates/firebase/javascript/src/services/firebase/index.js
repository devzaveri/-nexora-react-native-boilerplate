// Firebase service integration
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

/**
 * Firebase service class that provides a wrapper around Firebase functionality
 */
class FirebaseService {
  /**
   * Get the current authenticated user
   * @returns {Object|null} The current user or null if not authenticated
   */
  getCurrentUser() {
    return auth().currentUser;
  }

  /**
   * Check if a user is currently authenticated
   * @returns {boolean} True if user is authenticated
   */
  isAuthenticated() {
    return !!auth().currentUser;
  }

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<UserCredential>} Firebase user credential
   */
  async signInWithEmailAndPassword(email, password) {
    return await auth().signInWithEmailAndPassword(email, password);
  }

  /**
   * Create new user with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<UserCredential>} Firebase user credential
   */
  async createUserWithEmailAndPassword(email, password) {
    return await auth().createUserWithEmailAndPassword(email, password);
  }

  /**
   * Sign out the current user
   * @returns {Promise<void>}
   */
  async signOut() {
    return await auth().signOut();
  }

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  async sendPasswordResetEmail(email) {
    return await auth().sendPasswordResetEmail(email);
  }

  /**
   * Update user profile
   * @param {Object} profile - Profile data to update
   * @returns {Promise<void>}
   */
  async updateProfile(profile) {
    const currentUser = auth().currentUser;
    if (currentUser) {
      return await currentUser.updateProfile(profile);
    }
    throw new Error('No authenticated user');
  }

  /**
   * Get a Firestore collection reference
   * @param {string} collectionPath - Path to the collection
   * @returns {FirebaseFirestoreTypes.CollectionReference}
   */
  collection(collectionPath) {
    return firestore().collection(collectionPath);
  }

  /**
   * Get a Firestore document reference
   * @param {string} documentPath - Path to the document
   * @returns {FirebaseFirestoreTypes.DocumentReference}
   */
  doc(documentPath) {
    return firestore().doc(documentPath);
  }

  /**
   * Add a document to a collection
   * @param {string} collectionPath - Path to the collection
   * @param {Object} data - Document data
   * @returns {Promise<FirebaseFirestoreTypes.DocumentReference>}
   */
  async addDocument(collectionPath, data) {
    return await firestore().collection(collectionPath).add({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  /**
   * Update a document
   * @param {string} documentPath - Path to the document
   * @param {Object} data - Document data to update
   * @returns {Promise<void>}
   */
  async updateDocument(documentPath, data) {
    return await firestore().doc(documentPath).update({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  /**
   * Delete a document
   * @param {string} documentPath - Path to the document
   * @returns {Promise<void>}
   */
  async deleteDocument(documentPath) {
    return await firestore().doc(documentPath).delete();
  }

  /**
   * Get document data
   * @param {string} documentPath - Path to the document
   * @returns {Promise<Object|null>} Document data or null if it doesn't exist
   */
  async getDocument(documentPath) {
    const doc = await firestore().doc(documentPath).get();
    return doc.exists ? doc.data() : null;
  }

  /**
   * Upload a file to Firebase Storage
   * @param {string} ref - Storage reference path
   * @param {string} uri - Local file URI
   * @param {Object} metadata - File metadata
   * @returns {Promise<string>} Download URL
   */
  async uploadFile(ref, uri, metadata = {}) {
    const reference = storage().ref(ref);
    await reference.putFile(uri, metadata);
    return await reference.getDownloadURL();
  }

  /**
   * Delete a file from Firebase Storage
   * @param {string} ref - Storage reference path
   * @returns {Promise<void>}
   */
  async deleteFile(ref) {
    return await storage().ref(ref).delete();
  }

  /**
   * Request push notification permissions
   * @returns {Promise<boolean>} True if permissions granted
   */
  async requestPushPermission() {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }

  /**
   * Get the FCM token
   * @returns {Promise<string>} FCM token
   */
  async getFCMToken() {
    return await messaging().getToken();
  }

  /**
   * Subscribe to a topic for push notifications
   * @param {string} topic - Topic name
   * @returns {Promise<void>}
   */
  async subscribeToTopic(topic) {
    return await messaging().subscribeToTopic(topic);
  }

  /**
   * Unsubscribe from a topic
   * @param {string} topic - Topic name
   * @returns {Promise<void>}
   */
  async unsubscribeFromTopic(topic) {
    return await messaging().unsubscribeFromTopic(topic);
  }

  /**
   * Log a custom analytics event
   * @param {string} name - Event name
   * @param {Object} params - Event parameters
   * @returns {Promise<void>}
   */
  async logEvent(name, params = {}) {
    return await analytics().logEvent(name, params);
  }

  /**
   * Log user properties for analytics
   * @param {string} name - Property name
   * @param {string} value - Property value
   * @returns {Promise<void>}
   */
  async setUserProperty(name, value) {
    return await analytics().setUserProperty(name, value);
  }

  /**
   * Set user ID for analytics
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  async setUserId(id) {
    return await analytics().setUserId(id);
  }

  /**
   * Log error to Firebase Crashlytics
   * @param {Error} error - Error object
   * @returns {Promise<void>}
   */
  async logError(error) {
    return await crashlytics().recordError(error);
  }
}

export default new FirebaseService();
