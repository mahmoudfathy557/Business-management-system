import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { createUser, updateUser, fetchUsers } from '../../redux/slices/usersSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { RegisterData, User, RootStackParamList } from '../../types';
import UserForm from '../../components/Users/UserForm';

type SaveUserRouteProp = RouteProp<RootStackParamList, 'SaveUser'>;

const SaveUserScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const route = useRoute<SaveUserRouteProp>();
    const userId = route.params?.userId;
    const isEdit = !!userId;

    const { users, isLoading: isUsersLoading } = useSelector((state: RootState) => state.users);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const user = users.find(u => u._id === userId);

    useEffect(() => {
        if (isEdit && !user && !isUsersLoading) {
            dispatch(fetchUsers());
        }
    }, [user, dispatch, isUsersLoading, isEdit]);

    const handleSubmit = async (formData: RegisterData | Partial<User>) => {
        setIsSubmitting(true);
        try {
            if (isEdit) {
                await dispatch(updateUser({ id: userId, data: formData as Partial<User> })).unwrap();
                Alert.alert('Success', 'User updated successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                // Ensure formData is RegisterData for creation
                if ('password' in formData) {
                    await dispatch(createUser(formData as RegisterData)).unwrap();
                    Alert.alert('Success', 'User created successfully', [
                        { text: 'OK', onPress: () => navigation.goBack() }
                    ]);
                } else {
                    Alert.alert('Error', 'Password is required for new user creation.');
                    return; // Exit if password is missing
                }
            }
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message || `Failed to ${isEdit ? 'update' : 'create'} user`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isUsersLoading && isEdit) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading user...</Text>
            </View>
        );
    }

    if (isEdit && !user) {
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
                    <Title style={styles.title}>{isEdit ? 'Edit User' : 'Add New User'}</Title>
                    <Text style={styles.subtitle}>
                        {isEdit ? 'Update the user information below' : 'Fill in the details to add a new user'}
                    </Text>

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

export default SaveUserScreen;