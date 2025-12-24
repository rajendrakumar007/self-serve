
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../services/axiosClient.js';

// Helper to extract a readable error message from Axios/Fetch errors.
const getErrorMessage = (err, fallback = 'Request failed') => {
  if (!err) return fallback;
  return (
    err.response?.data?.message ||
    err.message ||
    fallback
  );
};

// Fetch list
export const fetchPolicies = createAsyncThunk(
  'policies/fetchPolicies',
  async ({ customerId }, { rejectWithValue }) => {
    try {
      const url = customerId ? `/policies?customerId=${customerId}` : '/policies';
      const res = await axiosClient.get(url);
      const data = Array.isArray(res.data) ? res.data : [];
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to fetch policies'));
    }
  }
);

// Fetch one by id
export const fetchPolicyById = createAsyncThunk(
  'policies/fetchPolicyById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/policies/${id}`);
      const data = res?.data ?? null;
      return data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to fetch policy'));
    }
  }
);

const slice = createSlice({
  name: 'policies',
  initialState: { items: [], selected: null, status: 'idle', error: null },
  reducers: {
    clearSelected: (s) => { s.selected = null; },
  },
  extraReducers: (b) => {
    b
      // list
      .addCase(fetchPolicies.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchPolicies.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload; })
      .addCase(fetchPolicies.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })
      // single
      .addCase(fetchPolicyById.pending, (s) => { s.status = 'loading'; s.error = null; s.selected = null; })
      .addCase(fetchPolicyById.fulfilled, (s, a) => { s.status = 'succeeded'; s.selected = a.payload; })
      .addCase(fetchPolicyById.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; s.selected = null; });
  }
});

export const { clearSelected } = slice.actions;
export default slice.reducer;
