import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';
import { ExpenseType } from '../../types';

interface ExpensesByTypeProps {
    expensesByType: Record<string, number>;
    totalExpenses: number;
}

const ExpensesByType: React.FC<ExpensesByTypeProps> = ({ expensesByType, totalExpenses }) => {
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
    );
};

const styles = StyleSheet.create({
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
});

export default ExpensesByType;
