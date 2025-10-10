import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchUsers, deleteUser } from '../../redux/slices';
 import { UsersHeader, UsersEmptyState, UserCard } from '../../components/Users';
import { User, UserRole } from '../../types';

const UsersScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const { users, isLoading } = useSelector((state: RootState) => state.users);
    const { user } = useSelector((state: RootState) => state.auth);

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchUsers());
        setRefreshing(false);
    };

    const filteredUsers = users.filter(userItem =>
        userItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userItem.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteUser = (userId: string) => {
        Alert.alert(
            'Delete User',
            'Are you sure you want to delete this user?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(deleteUser(userId));
                    },
                },
            ]
        );
    };

    const renderUser = ({ item }: { item: User }) => (
        <UserCard
            user={item}
            onPress={() => (navigation as any).navigate('UserDetails' as never, { userId: item._id } as never)}
            onEdit={() => (navigation as any).navigate('EditUser' as never, { userId: item._id } as never)}
            onDelete={() => handleDeleteUser(item._id)}
            showActions={user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN}
        />
    );

    const renderHeader = () => (
        <UsersHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalUsers={users.length}
            adminUsers={users.filter(userItem => userItem.role === UserRole.ADMIN || userItem.role === UserRole.SUPER_ADMIN).length}
            activeUsers={users.filter(userItem => userItem.isActive).length}
        />
    );

    const renderEmpty = () => (
        <UsersEmptyState hasSearchQuery={!!searchQuery} />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredUsers}
                renderItem={renderUser}
                keyExtractor={(item) => item._id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={styles.listContainer}
            />

            {(user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN) && (
                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => navigation.navigate('AddUser' as never)}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
        paddingBottom: 80,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#6200ea',
    },
});

export default UsersScreen;
