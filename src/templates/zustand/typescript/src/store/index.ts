// Main store export file for Zustand
import { authStore } from './authStore';
import { appStore } from './appStore';

/**
 * This file exports all stores for easier imports throughout the app
 */

export { authStore, appStore };

// Export store types
export type AuthStore = ReturnType<typeof authStore.getState>;
export type AppStore = ReturnType<typeof appStore.getState>;
