
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../api/axiosClient.js';

export const fetchPolicies = createAsyncThunk(
  'policies/fetchPolicies',
  async ({ customerId }, { rejectWithValue }) => {
    try {
      const url = customerId ? `/policies?customerId=${customerId}` : '/policies';
      const res = await axiosClient.get(url);
      return res.data || [];
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch policies');
    }
  }
);

export const fetchPolicyById = createAsyncThunk(
  'policies/fetchPolicyById',
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.get(`/policies/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.message || 'Failed to fetch policy');
    }
  }
);

const slice = createSlice({
  name: 'policies',
  initialState: { items: [], selected: null, status: 'idle', error: null },
  reducers: { clearSelected: (s) => { s.selected = null; } },
  extraReducers: (b) => {
    b
      .addCase(fetchPolicies.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(fetchPolicies.fulfilled, (s, a) => { s.status = 'succeeded'; s.items = a.payload; })
      .addCase(fetchPolicies.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; })
      .addCase(fetchPolicyById.pending, (s) => { s.status = 'loading'; s.error = null; s.selected = null; })
      .addCase(fetchPolicyById.fulfilled, (s, a) => { s.status = 'succeeded'; s.selected = a.payload; })
      .addCase(fetchPolicyById.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload; s.selected = null; });
  }
});

export const { clearSelected } = slice.actions;
export default slice.reducer;
