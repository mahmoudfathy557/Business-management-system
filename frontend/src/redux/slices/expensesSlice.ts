import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';
import { Expense, ExpenseType } from '../../types';

// Expenses State Interface
interface ExpensesState {
    expenses: Expense[];
    totalExpenses: number;
    expensesByType: Record<ExpenseType, number>;
    isLoading: boolean;
    error: string | null;
}

const initialExpensesState: ExpensesState = {
    expenses: [],
    totalExpenses: 0,
    expensesByType: {
        [ExpenseType.FUEL]: 0,
        [ExpenseType.MAINTENANCE]: 0,
        [ExpenseType.SALARY]: 0,
        [ExpenseType.OTHER]: 0,
    },
    isLoading: false,
    error: null,
};

// Expenses Async Thunks
export const fetchExpenses = createAsyncThunk(
    'expenses/fetchExpenses',
    async ({ page = 1, limit = 50, period = 'today' }: { page?: number; limit?: number; period?: string }, { rejectWithValue }) => {
        try {
            const response = await apiService.getExpenses(page, limit, period);
            return response; // Return the full response object
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch expenses');
        }
    }
);

export const createExpense = createAsyncThunk(
    'expenses/createExpense',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await apiService.createExpense(data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create expense');
        }
    }
);

export const updateExpense = createAsyncThunk(
    'expenses/updateExpense',
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const response = await apiService.updateExpense(id, data);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update expense');
        }
    }
);

export const deleteExpense = createAsyncThunk(
    'expenses/deleteExpense',
    async (id: string, { rejectWithValue }) => {
        try {
            await apiService.deleteExpense(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete expense');
        }
    }
);

// Expenses Slice
const expensesSlice = createSlice({
    name: 'expenses',
    initialState: initialExpensesState,
    reducers: {
        clearExpensesError: (state) => {
            state.error = null;
        },
        resetExpensesState: () => initialExpensesState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.expenses = action.payload.data;

                // Calculate totals
                const total = action.payload.data.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
                state.totalExpenses = total;

                // Calculate by type
                const byType = action.payload.data.reduce((acc: Record<ExpenseType, number>, expense: Expense) => {
                    acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
                    return acc;
                }, {} as Record<ExpenseType, number>);
                state.expensesByType = byType;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(createExpense.fulfilled, (state, action) => {
                state.expenses.unshift(action.payload);
                state.totalExpenses += action.payload.amount;
                state.expensesByType[action.payload.type] = (state.expensesByType[action.payload.type] || 0) + action.payload.amount;
            })
            .addCase(createExpense.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                const index = state.expenses.findIndex(e => e.id === action.payload.id);
                if (index !== -1) {
                    const oldExpense = state.expenses[index];
                    state.totalExpenses -= oldExpense.amount;
                    state.expensesByType[oldExpense.type] = (state.expensesByType[oldExpense.type] || 0) - oldExpense.amount;

                    state.expenses[index] = action.payload;

                    state.totalExpenses += action.payload.amount;
                    state.expensesByType[action.payload.type] = (state.expensesByType[action.payload.type] || 0) + action.payload.amount;
                }
            })
            .addCase(updateExpense.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                const deletedExpense = state.expenses.find(e => e.id === action.payload);
                if (deletedExpense) {
                    state.expenses = state.expenses.filter(e => e.id !== action.payload);
                    state.totalExpenses -= deletedExpense.amount;
                    state.expensesByType[deletedExpense.type] = (state.expensesByType[deletedExpense.type] || 0) - deletedExpense.amount;
                }
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearExpensesError, resetExpensesState } = expensesSlice.actions;
export { expensesSlice };
