import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import { DashboardSummary } from '../../types';

// Dashboard Async Thunks
export const fetchDashboardSummary = createAsyncThunk(
    'dashboard/fetchSummary',
    async () => {
        const response = await apiService.getDashboardSummary();
        return response;
    }
);

// Dashboard Slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        summary: null as DashboardSummary | null,
        isLoading: false,
        error: null as string | null,
    },
    reducers: {
        clearDashboardError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardSummary.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
                state.isLoading = false;
                state.summary = action.payload;
            })
            .addCase(fetchDashboardSummary.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch dashboard data';
            });
    },
});

export const { clearDashboardError } = dashboardSlice.actions;
export { dashboardSlice };
