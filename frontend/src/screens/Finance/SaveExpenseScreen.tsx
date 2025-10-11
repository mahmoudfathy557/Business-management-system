import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types';

type SaveExpenseRouteProp = RouteProp<RootStackParamList, 'SaveExpense'>;

const SaveExpenseScreen: React.FC = () => {
    const route = useRoute<SaveExpenseRouteProp>();
    const expenseId = route.params?.expenseId;
    const isEdit = !!expenseId;

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title>{isEdit ? 'Edit Expense' : 'Add New Expense'}</Title>
                    <Text>
                        {isEdit 
                            ? `Edit expense form for ID: ${expenseId} will be implemented here.` 
                            : 'Add expense form will be implemented here.'}
                    </Text>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    card: {
        elevation: 2,
    },
});

export default SaveExpenseScreen;