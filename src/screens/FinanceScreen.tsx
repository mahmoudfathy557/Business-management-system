import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, Title, Button, SegmentedButtons, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch, RootState } from '../redux/store';
import ExpenseForm from '../components/ExpenseForm';
import { Expense, ExpenseType } from '../types';
import apiService from '../services/api';

const FinanceScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const { user } = useSelector((state: RootState) => state.auth);

    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [expensesByType, setExpensesByType] = useState<Record<ExpenseType, number>>({
        [ExpenseType.FUEL]: 0,
        [ExpenseType.MAINTENANCE]: 0,
        [ExpenseType.SALARY]: 0,
        [ExpenseType.OTHER]: 0,
    });

    useEffect(() => {
        loadExpenses();
    }, [selectedPeriod]);

    const loadExpenses = async () => {
        setIsLoading(true);
        try {
            const response = await apiService.getExpenses(1, 50);
            setExpenses(response.data);

            // Calculate totals
            const total = response.data.reduce((sum, expense) => sum + expense.amount, 0);
            setTotalExpenses(total);

            // Calculate by type
            const byType = response.data.reduce((acc, expense) => {
                acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
                return acc;
            }, {} as Record<ExpenseType, number>);
            setExpensesByType(byType);
        } catch (error) {
            console.error('Error loading expenses:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadExpenses();
        setRefreshing(false);
    };

    const getExpenseTypeLabel = (type: ExpenseType) => {
        switch (type) {
            case ExpenseType.FUEL:
                return 'Fuel';
            case ExpenseType.MAINTENANCE:
                return 'Maintenance';
            case ExpenseType.SALARY:
                return 'Salary';
            case ExpenseType.OTHER:
                return 'Other';
            default:
                return type;
        }
    };

    const getExpenseTypeColor = (type: ExpenseType) => {
        switch (type) {
            case ExpenseType.FUEL:
                return '#ff9800';
            case ExpenseType.MAINTENANCE:
                return '#f44336';
            case ExpenseType.SALARY:
                return '#2196f3';
            case ExpenseType.OTHER:
                return '#9c27b0';
            default:
                return '#666';
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Period Selector */}
                <Card style={styles.periodCard}>
                    <Card.Content>
                        <Title>Select Period</Title>
                        <SegmentedButtons
                            value={selectedPeriod}
                            onValueChange={setSelectedPeriod}
                            buttons={[
                                { value: 'today', label: 'Today' },
                                { value: 'week', label: 'This Week' },
                                { value: 'month', label: 'This Month' },
                                { value: 'year', label: 'This Year' },
                            ]}
                            style={styles.segmentedButtons}
                        />
                    </Card.Content>
                </Card>

                {/* Summary Cards */}
                <View style={styles.summaryContainer}>
                    <Card style={styles.summaryCard}>
                        <Card.Content style={styles.summaryContent}>
                            <Text style={styles.summaryValue}>${totalExpenses.toFixed(2)}</Text>
                            <Text style={styles.summaryLabel}>Total Expenses</Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.summaryCard}>
                        <Card.Content style={styles.summaryContent}>
                            <Text style={styles.summaryValue}>{expenses.length}</Text>
                            <Text style={styles.summaryLabel}>Transactions</Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Expenses by Type */}
                <Card style={styles.typeCard}>
                    <Card.Content>
                        <Title>Expenses by Type</Title>
                        <View style={styles.typeContainer}>
                            {Object.entries(expensesByType).map(([type, amount]) => (
                                <View key={type} style={styles.typeItem}>
                                    <View style={styles.typeHeader}>
                                        <Text style={styles.typeLabel}>
                                            {getExpenseTypeLabel(type as ExpenseType)}
                                        </Text>
                                        <Text style={[
                                            styles.typeAmount,
                                            { color: getExpenseTypeColor(type as ExpenseType) }
                                        ]}>
                                            ${amount.toFixed(2)}
                                        </Text>
                                    </View>
                                    <View style={styles.typeBar}>
                                        <View
                                            style={[
                                                styles.typeBarFill,
                                                {
                                                    width: `${totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0}%`,
                                                    backgroundColor: getExpenseTypeColor(type as ExpenseType)
                                                }
                                            ]}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                {/* Recent Expenses */}
                <Card style={styles.expensesCard}>
                    <Card.Content>
                        <Title>Recent Expenses</Title>
                        {expenses.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No expenses found</Text>
                                <Text style={styles.emptySubtext}>
                                    Add your first expense to start tracking
                                </Text>
                            </View>
                        ) : (
                            expenses.slice(0, 10).map((expense) => (
                                <ExpenseForm
                                    key={expense.id}
                                    expense={expense}
                                    onPress={() => navigation.navigate('EditExpense' as never, { expenseId: expense.id } as never)}
                                />
                            ))
                        )}
                    </Card.Content>
                </Card>
            </ScrollView>

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate('AddExpense' as never)}
            />
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
    periodCard: {
        margin: 16,
        elevation: 2,
    },
    segmentedButtons: {
        marginTop: 12,
    },
    summaryContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
    },
    summaryCard: {
        flex: 1,
        elevation: 2,
    },
    summaryContent: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    summaryLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    typeCard: {
        margin: 16,
        elevation: 2,
    },
    typeContainer: {
        marginTop: 12,
    },
    typeItem: {
        marginBottom: 16,
    },
    typeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    typeLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    typeAmount: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    typeBar: {
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    typeBarFill: {
        height: '100%',
        borderRadius: 2,
    },
    expensesCard: {
        margin: 16,
        marginBottom: 100,
        elevation: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#6200ea',
    },
});

export default FinanceScreen;
