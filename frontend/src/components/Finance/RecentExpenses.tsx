import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';
import ExpenseForm from './ExpenseForm';
import { Expense } from '../../types';

interface RecentExpensesProps {
    expenses: Expense[];
    onExpensePress: (expenseId: string) => void;
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({ expenses, onExpensePress }) => {
    return (
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
                    expenses.slice(0, 10).map((expense: Expense) => (
                        <ExpenseForm
                            key={expense._id}
                            expense={expense}
                            onPress={() => onExpensePress(expense._id)}
                        />
                    ))
                )}
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
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
});

export default RecentExpenses;
