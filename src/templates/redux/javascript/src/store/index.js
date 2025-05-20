import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import authReducer from './slices/authSlice';
import appReducer from './slices/appSlice';
/* {{#if api}} */
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

// Export store types
export const RootState = store.getState();
export const AppDispatch = store.dispatch;
