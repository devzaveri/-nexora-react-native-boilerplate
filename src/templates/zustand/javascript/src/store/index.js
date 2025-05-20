// Main store export file for Zustand
import { create } from 'zustand';
import { authStore } from './authStore';
import { appStore } from './appStore';

/**
 * This file exports all stores for easier imports throughout the app
 */

export { authStore, appStore };
