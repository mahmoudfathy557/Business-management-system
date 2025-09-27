import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

interface ExpenseSummaryProps {
    totalExpenses: number;
    transactionCount: number;
}

const ExpenseSummary: React.FC<ExpenseSummaryProps> = ({ totalExpenses, transactionCount }) => {
    return (
        <View style={styles.summaryContainer}>
            <Card style={styles.summaryCard}>
                <Card.Content style={styles.summaryContent}>
                    <Text style={styles.summaryValue}>${totalExpenses.toFixed(2)}</Text>
                    <Text style={styles.summaryLabel}>Total Expenses</Text>
                </Card.Content>
            </Card>

            <Card style={styles.summaryCard}>
                <Card.Content style={styles.summaryContent}>
                    <Text style={styles.summaryValue}>{transactionCount}</Text>
                    <Text style={styles.summaryLabel}>Transactions</Text>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default ExpenseSummary;
