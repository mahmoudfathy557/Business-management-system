import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Chip, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchDashboardSummary } from '../redux/slices';
import { UserRole } from '../types';
import { MaterialIcons } from '@expo/vector-icons';

const DashboardScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { summary, isLoading } = useSelector((state: RootState) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardSummary());
    }, [dispatch]);

    const onRefresh = () => {
        dispatch(fetchDashboardSummary());
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getRoleBasedActions = () => {
        switch (user?.role) {
            case UserRole.ADMIN:
                return [
                    { title: 'Manage Inventory', icon: 'inventory', color: '#4caf50' },
                    { title: 'View Reports', icon: 'assessment', color: '#2196f3' },
                    { title: 'Manage Users', icon: 'people', color: '#ff9800' },
                    { title: 'Finance Overview', icon: 'account-balance', color: '#9c27b0' },
                ];
            case UserRole.INVENTORY_MANAGER:
                return [
                    { title: 'Manage Stock', icon: 'inventory', color: '#4caf50' },
                    { title: 'Add Products', icon: 'add-box', color: '#2196f3' },
                    { title: 'Stock Alerts', icon: 'warning', color: '#ff9800' },
                ];
            case UserRole.DRIVER:
                return [
                    { title: 'Daily Sales', icon: 'attach-money', color: '#4caf50' },
                    { title: 'My Car', icon: 'directions-car', color: '#2196f3' },
                    { title: 'Expenses', icon: 'receipt', color: '#ff9800' },
                ];
            default:
                return [];
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>{getGreeting()}, {user?.name}!</Text>
                    <Chip mode="outlined" style={styles.roleChip}>
                        {user?.role?.replace('_', ' ').toUpperCase()}
                    </Chip>
                </View>

                {/* Summary Cards */}
                {summary && (
                    <View style={styles.summaryContainer}>
                        <Card style={styles.summaryCard}>
                            <Card.Content style={styles.summaryContent}>
                                <MaterialIcons name="trending-up" size={24} color="#4caf50" />
                                <View style={styles.summaryText}>
                                    <Text style={styles.summaryValue}>${summary.todayIncome.toFixed(2)}</Text>
                                    <Text style={styles.summaryLabel}>Today's Income</Text>
                                </View>
                            </Card.Content>
                        </Card>

                        <Card style={styles.summaryCard}>
                            <Card.Content style={styles.summaryContent}>
                                <MaterialIcons name="trending-down" size={24} color="#f44336" />
                                <View style={styles.summaryText}>
                                    <Text style={styles.summaryValue}>${summary.todayExpenses.toFixed(2)}</Text>
                                    <Text style={styles.summaryLabel}>Today's Expenses</Text>
                                </View>
                            </Card.Content>
                        </Card>

                        <Card style={styles.summaryCard}>
                            <Card.Content style={styles.summaryContent}>
                                <MaterialIcons name="account-balance" size={24} color="#2196f3" />
                                <View style={styles.summaryText}>
                                    <Text style={[
                                        styles.summaryValue,
                                        { color: summary.netProfit >= 0 ? '#4caf50' : '#f44336' }
                                    ]}>
                                        ${summary.netProfit.toFixed(2)}
                                    </Text>
                                    <Text style={styles.summaryLabel}>Net Profit</Text>
                                </View>
                            </Card.Content>
                        </Card>
                    </View>
                )}

                {/* Low Stock Alerts */}
                {summary?.lowStockProducts && summary.lowStockProducts.length > 0 && (
                    <Card style={styles.alertCard}>
                        <Card.Content>
                            <Title style={styles.alertTitle}>
                                <MaterialIcons name="warning" size={20} color="#ff9800" />
                                {' '}Low Stock Alerts
                            </Title>
                            {summary.lowStockProducts.slice(0, 3).map((product) => (
                                <View key={product.id} style={styles.alertItem}>
                                    <Text style={styles.alertProduct}>{product.name}</Text>
                                    <Text style={styles.alertStock}>
                                        Stock: {product.stockQuantity} (Min: {product.minStockLevel})
                                    </Text>
                                </View>
                            ))}
                            {summary.lowStockProducts.length > 3 && (
                                <Text style={styles.alertMore}>
                                    +{summary.lowStockProducts.length - 3} more products
                                </Text>
                            )}
                        </Card.Content>
                    </Card>
                )}

                {/* Quick Actions */}
                <Card style={styles.actionsCard}>
                    <Card.Content>
                        <Title>Quick Actions</Title>
                        <View style={styles.actionsGrid}>
                            {getRoleBasedActions().map((action, index) => (
                                <Button
                                    key={index}
                                    mode="outlined"
                                    style={[styles.actionButton, { borderColor: action.color }]}
                                    labelStyle={{ color: action.color }}
                                    icon={action.icon}
                                    onPress={() => {
                                        // Navigation will be handled by the tab navigator
                                    }}
                                >
                                    {action.title}
                                </Button>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                {/* Statistics */}
                {summary && (
                    <Card style={styles.statsCard}>
                        <Card.Content>
                            <Title>Overview</Title>
                            <View style={styles.statsGrid}>
                                <View style={styles.statItem}>
                                    <MaterialIcons name="inventory" size={24} color="#4caf50" />
                                    <Text style={styles.statValue}>{summary.totalProducts}</Text>
                                    <Text style={styles.statLabel}>Products</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <MaterialIcons name="directions-car" size={24} color="#2196f3" />
                                    <Text style={styles.statValue}>{summary.totalCars}</Text>
                                    <Text style={styles.statLabel}>Cars</Text>
                                </View>
                                <View style={styles.statItem}>
                                    <MaterialIcons name="people" size={24} color="#ff9800" />
                                    <Text style={styles.statValue}>{summary.activeDrivers}</Text>
                                    <Text style={styles.statLabel}>Drivers</Text>
                                </View>
                            </View>
                        </Card.Content>
                    </Card>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        elevation: 2,
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    roleChip: {
        backgroundColor: '#e3f2fd',
    },
    summaryContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 8,
    },
    summaryCard: {
        flex: 1,
        elevation: 2,
    },
    summaryContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
    },
    summaryText: {
        marginLeft: 12,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    summaryLabel: {
        fontSize: 12,
        color: '#666',
    },
    alertCard: {
        margin: 16,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#ff9800',
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    alertItem: {
        marginBottom: 8,
    },
    alertProduct: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    alertStock: {
        fontSize: 12,
        color: '#666',
    },
    alertMore: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 4,
    },
    actionsCard: {
        margin: 16,
        elevation: 2,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 12,
    },
    actionButton: {
        flex: 1,
        minWidth: '45%',
        marginBottom: 8,
    },
    statsCard: {
        margin: 16,
        marginBottom: 100,
        elevation: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
});

export default DashboardScreen;
