import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface DashboardSummary {
    todayIncome: number;
    todayExpenses: number;
    netProfit: number;
}

interface SummaryCardsProps {
    summary: DashboardSummary | null;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
    if (!summary) return null;

    return (
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
    );
};

const styles = StyleSheet.create({
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
});

export default SummaryCards;
