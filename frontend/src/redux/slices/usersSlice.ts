import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import { User, RegisterData } from '../../types';

// Users Async Thunks
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        const response = await apiService.getUsers();
        return response;
    }
);

export const createUser = createAsyncThunk(
    'users/createUser',
    async (data: RegisterData) => {
        const response = await apiService.createUser(data);
        return response;
    }
);

export const updateUser = createAsyncThunk(
    'users/updateUser',
    async ({ id, data }: { id: string; data: any }) => {
        const response = await apiService.updateUser(id, data);
        return response;
    }
);

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id: string) => {
        await apiService.deleteUser(id);
        return id;
    }
);

// Users Slice
const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [] as User[],
        isLoading: false,
        error: null as string | null,
    },
    reducers: {
        clearUsersError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || 'Failed to fetch users';
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u.id !== action.payload);
            });
    },
});

export const { clearUsersError } = usersSlice.actions;
export { usersSlice };
