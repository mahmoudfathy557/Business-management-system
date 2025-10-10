import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Button, Chip } from 'react-native-paper';
import { User } from '../../types'; // Assuming User type is defined here

interface UserListProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (userId: string) => void;
    onRefresh: () => void;
    loading: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete, onRefresh, loading }) => {
    const renderUserItem = ({ item }: { item: User }) => (
        <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userEmail}>{item.email}</Text>
                    <Text style={styles.userRole}>Role: {item.role}</Text>
                    <Chip
                        mode="outlined"
                        style={[styles.statusChip, item.isActive ? styles.activeChip : styles.inactiveChip]}
                        textStyle={item.isActive ? styles.activeText : styles.inactiveText}
                    >
                        {item.isActive ? 'Active' : 'Inactive'}
                    </Chip>
                </View>
                <View style={styles.actions}>
                    <IconButton
                        icon="pencil"
                        iconColor="#007bff"
                        onPress={() => onEdit(item)}
                    />
                    <IconButton
                        icon="delete"
                        iconColor="#dc3545"
                        onPress={() => onDelete(item._id)}
                    />
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Button icon="refresh" onPress={onRefresh} loading={loading} style={styles.refreshButton}>
                Refresh Users
            </Button>
            {users.length === 0 ? (
                <Text style={styles.emptyText}>No users found.</Text>
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderUserItem}
                    keyExtractor={(item) => item._id}
                    onRefresh={onRefresh}
                    refreshing={loading}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    refreshButton: {
        marginVertical: 10,
    },
    card: {
        marginVertical: 8,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    userRole: {
        fontSize: 14,
        fontStyle: 'italic',
    },
    actions: {
        flexDirection: 'row',
    },
    statusChip: {
        marginTop: 5,
        alignSelf: 'flex-start',
    },
    activeChip: {
        backgroundColor: '#e8f5e8', // Light green
    },
    inactiveChip: {
        backgroundColor: '#ffebee', // Light red
    },
    activeText: {
        color: '#2e7d32', // Dark green
    },
    inactiveText: {
        color: '#c62828', // Dark red
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#888',
    },
});

export default UserList;
