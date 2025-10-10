import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { UserRole } from '../types';

// Import screens
import LoginScreen from '../screens/Login/LoginScreen';
 
import CarsScreen from '../screens/Cars/CarsScreen';
import FinanceScreen from '../screens/Finance/FinanceScreen';
import ReportsScreen from '../screens/Reports/ReportsScreen';
import UsersScreen from '../screens/Users/UsersScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import ProductDetailsScreen from '../screens/Inventory/ProductDetailsScreen';
import CarDetailsScreen from '../screens/Cars/CarDetailsScreen';
import AddProductScreen from '../screens/Inventory/AddProductScreen';
import EditProductScreen from '../screens/Inventory/EditProductScreen';
import AddCarScreen from '../screens/Cars/AddCarScreen';
import EditCarScreen from '../screens/Cars/EditCarScreen';
import AddExpenseScreen from '../screens/Finance/AddExpenseScreen';
import EditExpenseScreen from '../screens/Finance/EditExpenseScreen';
import AddUserScreen from '../screens/Users/AddUserScreen';
import EditUserScreen from '../screens/Users/EditUserScreen';
import UserDetailsScreen from '../screens/Users/UserDetailsScreen';

// Import icons
import { MaterialIcons } from '@expo/vector-icons';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import InventoryScreen from '../screens/Inventory/InventoryScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator for authenticated users
const TabNavigator = () => {
    const user = useSelector((state: RootState) => state.auth.user);

    const getTabScreens = () => {
        const screens = [
            {
                name: 'Dashboard',
                component: DashboardScreen,
                icon: 'dashboard',
                label: 'Dashboard',
            },
        ];

        // Add role-based screens
        if (user?.role === UserRole.ADMIN || user?.role === UserRole.INVENTORY_MANAGER) {
            screens.push({
                name: 'Inventory',
                component: InventoryScreen,
                icon: 'inventory',
                label: 'Inventory',
            });
        }

        if (user?.role === UserRole.ADMIN || user?.role === UserRole.DRIVER) {
            screens.push({
                name: 'Cars',
                component: CarsScreen,
                icon: 'directions-car',
                label: 'Cars',
            });
        }

        if (user?.role === UserRole.ADMIN) {
            screens.push(
                {
                    name: 'Finance',
                    component: FinanceScreen,
                    icon: 'account-balance',
                    label: 'Finance',
                },
                {
                    name: 'Reports',
                    component: ReportsScreen,
                    icon: 'assessment',
                    label: 'Reports',
                },
                {
                    name: 'Users',
                    component: UsersScreen,
                    icon: 'people',
                    label: 'Users',
                }
            );
        }

        screens.push({
            name: 'Settings',
            component: SettingsScreen,
            icon: 'settings',
            label: 'Settings',
        });

        return screens;
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    const screen = getTabScreens().find(s => s.name === route.name);
                    return (
                        <MaterialIcons
                            name={screen?.icon as any}
                            size={size}
                            color={color}
                        />
                    );
                },
                tabBarActiveTintColor: '#6200ea',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
            })}
        >
            {getTabScreens().map((screen) => (
                <Tab.Screen
                    key={screen.name}
                    name={screen.name}
                    component={screen.component}
                    options={{ title: screen.label }}
                />
            ))}
        </Tab.Navigator>
    );
};

// Main Stack Navigator
const AppNavigator = () => {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : (
                    <>
                        <Stack.Screen name="MainTabs" component={TabNavigator} />

                        {/* Product Screens */}
                        <Stack.Screen
                            name="ProductDetails"
                            component={ProductDetailsScreen}
                            options={{ 
                                title: 'Product Details',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#6200ea',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                        <Stack.Screen
                            name="AddProduct"
                            component={AddProductScreen}
                            options={{ 
                                title: 'Add Product',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#6200ea',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                        <Stack.Screen
                            name="EditProduct"
                            component={EditProductScreen}
                            options={{ 
                                title: 'Edit Product',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#6200ea',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}
                        />

                        {/* Car Screens */}
                        <Stack.Screen
                            name="CarDetails"
                            component={CarDetailsScreen}
                            options={{ 
                                title: 'Car Details',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#6200ea',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                        <Stack.Screen
                            name="AddCar"
                            component={AddCarScreen}
                            options={{ 
                                title: 'Add Car',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#6200ea',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                        <Stack.Screen
                            name="EditCar"
                            component={EditCarScreen}
                            options={{ 
                                title: 'Edit Car',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#6200ea',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}
                        />

                        {/* Expense Screens */}
                        <Stack.Screen
                            name="AddExpense"
                            component={AddExpenseScreen}
                            options={{ 
                                title: 'Add Expense',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#6200ea',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                        <Stack.Screen
                            name="EditExpense"
                            component={EditExpenseScreen}
                            options={{ 
                                title: 'Edit Expense',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#6200ea',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}
                        />

                        {/* User Screens */}
                        <Stack.Screen
                            name="UserDetails"
                            component={UserDetailsScreen}
                            options={{
                                title: 'User Details',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#6200ea',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                        <Stack.Screen
                            name="AddUser"
                            component={AddUserScreen}
                            options={{
                                title: 'Add User',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#6200ea',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                        <Stack.Screen
                            name="EditUser"
                            component={EditUserScreen}
                            options={{
                                title: 'Edit User',
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: '#6200ea',
                                },
                                headerTintColor: '#fff',
                                headerTitleStyle: {
                                    fontWeight: 'bold',
                                },
                            }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
