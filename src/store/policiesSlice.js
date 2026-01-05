import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../services/axiosClient.js";

/**
 * Policies Redux Slice
 *
 * Manages the state for insurance policies using Redux Toolkit.
 * Handles fetching policy lists and individual policy details with
 * proper loading, success, and error states.
 *
 * State Structure:
 * {
 *   items: Policy[],        // Array of all policies
 *   selected: Policy | null, // Currently selected policy for details view
 *   status: string,         // 'idle' | 'loading' | 'succeeded' | 'failed'
 *   error: string | null    // Error message if request failed
 * }
 *
 * Actions:
 * - fetchPolicies: Fetch all policies for a user
 * - fetchPolicyById: Fetch single policy by ID
 * - clearSelected: Clear the selected policy
 */

/**
 * Error Message Helper
 * Extracts readable error messages from various error types
 */
const getErrorMessage = (err, fallback = "Request failed") => {
  if (!err) return fallback;
  // Try to get error from response data first, then fallback to error message
  return err.response?.data?.message || err.message || fallback;
};

/**
 * Async Thunk: Fetch All Policies
 * Fetches policies for a specific user or all policies if no user specified
 */
export const fetchPolicies = createAsyncThunk(
  "policies/fetchPolicies",
  async ({ userId }, { rejectWithValue }) => {
    try {
      // Build URL with optional userId filter
      const url = userId ? `/policies?userId=${userId}` : "/policies";
      const res = await axiosClient.get(url);

      // Ensure response data is an array
      const data = Array.isArray(res.data) ? res.data : [];
      return data;
    } catch (err) {
      // Return error message for handling in reducers
      return rejectWithValue(getErrorMessage(err, "Failed to fetch policies"));
    }
  }
);

/**
 * Async Thunk: Fetch Single Policy by ID
 * Fetches detailed information for a specific policy
 */
export const fetchPolicyById = createAsyncThunk(
  "policies/fetchPolicyById",
  async ({ id }, { rejectWithValue }) => {
    try {
      // Query by policyId since we're using string IDs
      const res = await axiosClient.get(`/policies?policyId=${id}`);

      // Return first item from array response or null
      const data = Array.isArray(res.data) ? res.data[0] : null;
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch policy"));
    }
  }
);

/**
 * Policies Slice Configuration
 * Defines the state structure, reducers, and async action handlers
 */
const slice = createSlice({
  name: "policies",

  // Initial state
  initialState: {
    items: [], // Array of policies
    selected: null, // Selected policy for details view
    status: "idle", // Loading state
    error: null, // Error message
  },

  // Synchronous reducers
  reducers: {
    // Clear the selected policy (useful for navigation)
    clearSelected: (state) => {
      state.selected = null;
    },
  },

  // Async action handlers (extraReducers)
  extraReducers: (builder) => {
    builder
      // fetchPolicies async action handlers
      .addCase(fetchPolicies.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPolicies.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload; // Store fetched policies
      })
      .addCase(fetchPolicies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store error message
      })

      // fetchPolicyById async action handlers
      .addCase(fetchPolicyById.pending, (state) => {
        state.status = "loading";
        state.error = null;
        state.selected = null; // Clear previous selection
      })
      .addCase(fetchPolicyById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selected = action.payload; // Store selected policy
      })
      .addCase(fetchPolicyById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload; // Store error message
        state.selected = null; // Clear selection on error
      });
  },
});

// Export actions and reducer
export const { clearSelected } = slice.actions;
export default slice.reducer;
