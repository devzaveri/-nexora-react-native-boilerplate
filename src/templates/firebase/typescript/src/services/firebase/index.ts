// Firebase service integration
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import storage, { FirebaseStorageTypes } from '@react-native-firebase/storage';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

/**
 * Firebase service class that provides a wrapper around Firebase functionality
 */
class FirebaseService {
  /**
   * Get the current authenticated user
   * @returns The current user or null if not authenticated
   */
  getCurrentUser(): FirebaseAuthTypes.User | null {
    return auth().currentUser;
  }

  /**
   * Check if a user is currently authenticated
   * @returns True if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!auth().currentUser;
  }

  /**
   * Sign in with email and password
   * @param email - User email
   * @param password - User password
   * @returns Firebase user credential
   */
  async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<FirebaseAuthTypes.UserCredential> {
    return await auth().signInWithEmailAndPassword(email, password);
  }

  /**
   * Create new user with email and password
   * @param email - User email
   * @param password - User password
   * @returns Firebase user credential
   */
  async createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<FirebaseAuthTypes.UserCredential> {
    return await auth().createUserWithEmailAndPassword(email, password);
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    return await auth().signOut();
  }

  /**
   * Send password reset email
   * @param email - User email
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    return await auth().sendPasswordResetEmail(email);
  }

  /**
   * Update user profile
   * @param profile - Profile data to update
   */
  async updateProfile(profile: { 
    displayName?: string | null; 
    photoURL?: string | null 
  }): Promise<void> {
    const currentUser = auth().currentUser;
    if (currentUser) {
      return await currentUser.updateProfile(profile);
    }
    throw new Error('No authenticated user');
  }

  /**
   * Get a Firestore collection reference
   * @param collectionPath - Path to the collection
   * @returns Firestore collection reference
   */
  collection(collectionPath: string): FirebaseFirestoreTypes.CollectionReference {
    return firestore().collection(collectionPath);
  }

  /**
   * Get a Firestore document reference
   * @param documentPath - Path to the document
   * @returns Firestore document reference
   */
  doc(documentPath: string): FirebaseFirestoreTypes.DocumentReference {
    return firestore().doc(documentPath);
  }

  /**
   * Add a document to a collection
   * @param collectionPath - Path to the collection
   * @param data - Document data
   * @returns Document reference
   */
  async addDocument<T>(
    collectionPath: string,
    data: T
  ): Promise<FirebaseFirestoreTypes.DocumentReference> {
    return await firestore().collection(collectionPath).add({
      ...data,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  /**
   * Update a document
   * @param documentPath - Path to the document
   * @param data - Document data to update
   */
  async updateDocument<T>(documentPath: string, data: T): Promise<void> {
    return await firestore().doc(documentPath).update({
      ...data,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
  }

  /**
   * Delete a document
   * @param documentPath - Path to the document
   */
  async deleteDocument(documentPath: string): Promise<void> {
    return await firestore().doc(documentPath).delete();
  }

  /**
   * Get document data
   * @param documentPath - Path to the document
   * @returns Document data or null if it doesn't exist
   */
  async getDocument<T>(documentPath: string): Promise<T | null> {
    const doc = await firestore().doc(documentPath).get();
    return doc.exists ? (doc.data() as T) : null;
  }

  /**
   * Upload a file to Firebase Storage
   * @param ref - Storage reference path
   * @param uri - Local file URI
   * @param metadata - File metadata
   * @returns Download URL
   */
  async uploadFile(
    ref: string,
    uri: string,
    metadata: FirebaseStorageTypes.SettableMetadata = {}
  ): Promise<string> {
    const reference = storage().ref(ref);
    await reference.putFile(uri, metadata);
    return await reference.getDownloadURL();
  }

  /**
   * Delete a file from Firebase Storage
   * @param ref - Storage reference path
   */
  async deleteFile(ref: string): Promise<void> {
    return await storage().ref(ref).delete();
  }

  /**
   * Request push notification permissions
   * @returns True if permissions granted
   */
  async requestPushPermission(): Promise<boolean> {
    const authStatus = await messaging().requestPermission();
    return (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    );
  }

  /**
   * Get the FCM token
   * @returns FCM token
   */
  async getFCMToken(): Promise<string> {
    return await messaging().getToken();
  }

  /**
   * Subscribe to a topic for push notifications
   * @param topic - Topic name
   */
  async subscribeToTopic(topic: string): Promise<void> {
    return await messaging().subscribeToTopic(topic);
  }

  /**
   * Unsubscribe from a topic
   * @param topic - Topic name
   */
  async unsubscribeFromTopic(topic: string): Promise<void> {
    return await messaging().unsubscribeFromTopic(topic);
  }

  /**
   * Log a custom analytics event
   * @param name - Event name
   * @param params - Event parameters
   */
  async logEvent(name: string, params: Record<string, any> = {}): Promise<void> {
    return await analytics().logEvent(name, params);
  }

  /**
   * Log user properties for analytics
   * @param name - Property name
   * @param value - Property value
   */
  async setUserProperty(name: string, value: string): Promise<void> {
    return await analytics().setUserProperty(name, value);
  }

  /**
   * Set user ID for analytics
   * @param id - User ID
   */
  async setUserId(id: string): Promise<void> {
    return await analytics().setUserId(id);
  }

  /**
   * Log error to Firebase Crashlytics
   * @param error - Error object
   */
  async logError(error: Error): Promise<void> {
    return await crashlytics().recordError(error);
  }
}

export default new FirebaseService();
