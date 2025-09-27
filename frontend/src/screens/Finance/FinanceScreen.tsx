import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchExpenses } from '../../redux/slices';
import { PeriodSelector, ExpenseSummary, ExpensesByType, RecentExpenses } from '../../components/Finance';
import { Expense, ExpenseType } from '../../types';

const FinanceScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const { user } = useSelector((state: RootState) => state.auth);

    const [refreshing, setRefreshing] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState('today');
 
    const { expenses, totalExpenses, expensesByType, isLoading, error } = useSelector(
        (state: RootState) => state.expenses
    );
 
    useEffect(() => {
        dispatch(fetchExpenses({ period: selectedPeriod }));
    }, [selectedPeriod, dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchExpenses({ period: selectedPeriod }));
        setRefreshing(false);
    };


    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <PeriodSelector
                    selectedPeriod={selectedPeriod}
                    onPeriodChange={setSelectedPeriod}
                />
                <ExpenseSummary
                    totalExpenses={totalExpenses}
                    transactionCount={expenses.length}
                />
                <ExpensesByType
                    expensesByType={expensesByType}
                    totalExpenses={totalExpenses}
                />
                <RecentExpenses
                    expenses={expenses}
                    onExpensePress={(expenseId) => (navigation as any).navigate('EditExpense' as never, { expenseId } as never)}
                />
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
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#6200ea',
    },
});

export default FinanceScreen;
