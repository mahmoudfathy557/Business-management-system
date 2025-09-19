import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';

const UsersScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Users Management</Title>
                    <Text>User management functionality will be implemented here.</Text>
                    <Text>This will include:</Text>
                    <Text>• View all users</Text>
                    <Text>• Add new users</Text>
                    <Text>• Edit user roles</Text>
                    <Text>• Delete users</Text>
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

export default UsersScreen;
