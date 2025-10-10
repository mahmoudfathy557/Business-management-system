import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Button, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { fetchUsers } from '../../redux/slices/usersSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { RootStackParamList } from '../../types';

type UserDetailsRouteProp = RouteProp<RootStackParamList, 'UserDetails'>;

const UserDetailsScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const route = useRoute<UserDetailsRouteProp>();
    const userId = route.params?.userId;

    const { users, isLoading } = useSelector((state: RootState) => state.users);
    const user = users.find(u => u._id === userId);

    useEffect(() => {
        if (!user && !isLoading) {
            dispatch(fetchUsers());
        }
    }, [user, dispatch, isLoading]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading user details...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>User not found.</Text>
                <Button mode="contained" onPress={() => navigation.goBack()}>
                    Go Back
                </Button>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>User Details</Title>
                    <Text style={styles.detailText}>Name: {user.name}</Text>
                    <Text style={styles.detailText}>Email: {user.email}</Text>
                    <Text style={styles.detailText}>Role: {user.role}</Text>
                    <Text style={styles.detailText}>Status: {user.isActive ? 'Active' : 'Inactive'}</Text>
                    <Text style={styles.detailText}>Created At: {new Date(user.createdAt).toLocaleDateString()}</Text>
                    <Text style={styles.detailText}>Last Updated: {new Date(user.updatedAt).toLocaleDateString()}</Text>
                </Card.Content>
            </Card>
        </ScrollView>
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    detailText: {
        fontSize: 16,
        marginBottom: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    errorText: {
        fontSize: 18,
        color: '#c62828',
        marginBottom: 16,
        textAlign: 'center',
    },
});

export default UserDetailsScreen;
