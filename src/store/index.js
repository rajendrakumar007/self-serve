
import { configureStore } from '@reduxjs/toolkit';
import policiesReducer from './policiesSlice.js';

const store = configureStore({
  reducer: { policies: policiesReducer }
});

export default store;
``
