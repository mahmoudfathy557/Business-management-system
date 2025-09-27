import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Chip } from 'react-native-paper';
import { Expense, ExpenseType } from '../../types';

interface ExpenseFormProps {
    expense: Expense;
    onPress?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onPress }) => {
    console.log("🚀 ~ ExpenseForm ~ expense:", expense)
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

    return (
        <Card style={styles.card} onPress={onPress}>
            <Card.Content>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Title style={styles.title}>{expense.description}</Title>
                        <Chip
                            mode="outlined"
                            style={[
                                styles.typeChip,
                                { backgroundColor: `${getExpenseTypeColor(expense.type)}20` }
                            ]}
                            textStyle={{ color: getExpenseTypeColor(expense.type) }}
                        >
                            {getExpenseTypeLabel(expense.type)}
                        </Chip>
                    </View>
                </View>

                <View style={styles.details}>
                    <View style={styles.amountContainer}>
                        <Paragraph style={styles.amount}>${expense.amount.toFixed(2)}</Paragraph>
                        <Paragraph style={styles.date}>
                            {new Date(expense.date).toLocaleDateString()}
                        </Paragraph>
                    </View>

                    {expense.carId && (
                        <View style={styles.carContainer}>
                            <Paragraph style={styles.carLabel}>Car ID:</Paragraph>
                            <Paragraph style={styles.carId}>{expense.carId._id}</Paragraph>
                        </View>
                    )}
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 4,
        marginHorizontal: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    typeChip: {
        alignSelf: 'flex-start',
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amountContainer: {
        flex: 1,
    },
    amount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#f44336',
    },
    date: {
        fontSize: 12,
        color: '#666',
    },
    carContainer: {
        alignItems: 'flex-end',
    },
    carLabel: {
        fontSize: 12,
        color: '#666',
    },
    carId: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2e7d32',
    },
});

export default ExpenseForm;
