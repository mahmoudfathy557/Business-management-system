// Export all slices and their actions
export { authSlice, clearError } from './authSlice';
export { productsSlice, clearProductsError } from './productsSlice';
export { carsSlice, clearCarsError } from './carsSlice';
export { expensesSlice, clearExpensesError, resetExpensesState } from './expensesSlice';
export { dashboardSlice, clearDashboardError } from './dashboardSlice';
export { usersSlice, clearUsersError } from './usersSlice';

// Export async thunks
export {
    loginUser,
    registerUser,
    loadUserFromStorage,
    logoutUser,
} from './authSlice';

export {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from './productsSlice';

export {
    fetchCars,
    createCar,
    updateCar,
    deleteCar,
} from './carsSlice';

export {
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
} from './expensesSlice';

export {
    fetchDashboardSummary,
} from './dashboardSlice';

export {
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
} from './usersSlice';
