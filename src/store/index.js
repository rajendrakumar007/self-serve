import { configureStore } from "@reduxjs/toolkit";
import policiesReducer from "./policiesSlice.js";

/**
 * Redux Store Configuration
 *
 * Central state management store for the entire application using Redux Toolkit.
 * Configures the store with reducers, middleware, and development tools.
 *
 * Features:
 * - Redux Toolkit's configureStore for simplified setup
 * - Automatic middleware configuration (including redux-thunk)
 * - Development tools integration (Redux DevTools)
 * - Modular reducer structure for scalability
 *
 * Store Structure:
 * {
 *   policies: {
 *     items: [],        // Array of all policies
 *     selected: null,   // Currently selected policy details
 *     status: 'idle',   // Loading state ('idle' | 'loading' | 'succeeded' | 'failed')
 *     error: null       // Error message if request failed
 *   }
 * }
 *
 * Usage:
 * import { useSelector, useDispatch } from 'react-redux';
 * const policies = useSelector(state => state.policies.items);
 * const dispatch = useDispatch();
 */

// Configure the Redux store with reducers
const store = configureStore({
  reducer: {
    policies: policiesReducer, // Policies state management
  },

  // Middleware is automatically configured by Redux Toolkit
  // Includes redux-thunk for async actions and redux-devtools in development
});

// Export the configured store for use in the app
export default store;
``;
