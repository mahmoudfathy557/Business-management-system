import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Button } from 'react-native-paper';
import { UserRole } from '../../types';

interface QuickAction {
    title: string;
    icon: string;
    color: string;
}

interface QuickActionsProps {
    userRole: UserRole | null;
}

const QuickActions: React.FC<QuickActionsProps> = ({ userRole }) => {
    const getRoleBasedActions = (): QuickAction[] => {
        switch (userRole) {
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

    const actions = getRoleBasedActions();

    return (
        <Card style={styles.actionsCard}>
            <Card.Content>
                <Title>Quick Actions</Title>
                <View style={styles.actionsGrid}>
                    {actions.map((action, index) => (
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
    );
};

const styles = StyleSheet.create({
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
});

export default QuickActions;
