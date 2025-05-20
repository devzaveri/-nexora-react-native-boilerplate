// @ts-ignore - These imports will be resolved during template processing
import { configureStore } from '@reduxjs/toolkit';
// @ts-ignore - These imports will be resolved during template processing
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import appReducer from './slices/appSlice';
/* {{#if api}} */
// @ts-ignore - This import will be resolved during template processing
import { api } from '../services/api';
/* {{/if}} */

const createStore = () => {
  // Create reducer object
  const reducer = {
    auth: authReducer,
    app: appReducer,
  };
  
  /* {{#if api}} */
  // Add the API reducer to the reducer object when API feature is enabled
  reducer[api.reducerPath] = api.reducer;
  /* {{/if}} */
  
  // Configure middleware
  let middlewareConfig = getDefaultMiddleware => 
    getDefaultMiddleware({
      serializableCheck: false,
    });
  
  /* {{#if api}} */
  // Add API middleware when API feature is enabled
  middlewareConfig = getDefaultMiddleware => 
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware);
  /* {{/if}} */
  
  // Create and return the store
  const store = configureStore({
    reducer,
    middleware: middlewareConfig,
  });
  
  /* {{#if api}} */
  // Enable listeners for RTK Query when API feature is enabled
  setupListeners(store.dispatch);
  /* {{/if}} */
  
  return store;
};

// Create the store
export const store = createStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
