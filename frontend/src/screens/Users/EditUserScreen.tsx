import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { updateUser, fetchUsers } from '../../redux/slices/usersSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { User, RegisterData, RootStackParamList } from '../../types';
import UserForm from '../../components/Users/UserForm';

type EditUserRouteProp = RouteProp<RootStackParamList, 'EditUser'>;

const EditUserScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const route = useRoute<EditUserRouteProp>();
    const userId = route.params?.userId;

    if (!userId) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>User ID is missing. Cannot edit user.</Text>
                <Button mode="contained" onPress={() => navigation.goBack()}>
                    Go Back
                </Button>
            </View>
        );
    }

    const { users, isLoading } = useSelector((state: RootState) => state.users);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const user = users.find(u => u._id === userId);

    useEffect(() => {
        if (!user && !isLoading) {
            dispatch(fetchUsers());
        }
    }, [user, dispatch, isLoading]);

    const handleSubmit = async (formData: Partial<User>) => {
        setIsSubmitting(true);
        try {
            await dispatch(updateUser({ id: userId, data: formData })).unwrap();
            Alert.alert('Success', 'User updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update user');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading user...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>User not found</Text>
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
                    <Title style={styles.title}>Edit User</Title>
                    <Text style={styles.subtitle}>Update the user information below</Text>

                    <Divider style={styles.divider} />

                    <UserForm
                        onSubmit={handleSubmit}
                        initialUser={user}
                        isLoading={isSubmitting}
                    />
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        margin: 16,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    divider: {
        marginVertical: 16,
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

export default EditUserScreen;
