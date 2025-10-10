import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Button, Divider } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { createUser } from '../../redux/slices/usersSlice';
import { AppDispatch } from '../../redux/store';
import { RegisterData, User } from '../../types';
import UserForm from '../../components/Users/UserForm';

const AddUserScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: RegisterData | Partial<User>) => {
        setIsLoading(true);
        try {
            // Ensure formData is RegisterData for creation
            if ('password' in formData) {
                await dispatch(createUser(formData as RegisterData)).unwrap();
                Alert.alert('Success', 'User created successfully', [
                    { text: 'OK', onPress: () => navigation.goBack() }
                ]);
            } else {
                Alert.alert('Error', 'Password is required for new user creation.');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create user');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>Add New User</Title>
                    <Text style={styles.subtitle}>Fill in the details to add a new user</Text>

                    <Divider style={styles.divider} />

                    <UserForm
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
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
});

export default AddUserScreen;
