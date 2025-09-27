import { configureStore } from '@reduxjs/toolkit';
import { authSlice, productsSlice, carsSlice, dashboardSlice, expensesSlice } from './slices';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    products: productsSlice.reducer,
    cars: carsSlice.reducer,
    dashboard: dashboardSlice.reducer,
    expenses: expensesSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
