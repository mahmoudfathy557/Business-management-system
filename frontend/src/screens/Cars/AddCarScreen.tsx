import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Button, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { createCar } from '../../redux/slices/carsSlice';
import { fetchUsers } from '../../redux/slices/usersSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { CarFormData, UserRole } from '../../types';
import CarForm from '../../components/Cars/CarForm';

const AddCarScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);

    const { users: allUsers, isLoading: isUsersLoading } = useSelector((state: RootState) => state.users);
    const drivers = allUsers.filter(user => user.role === UserRole.DRIVER);

    React.useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);
    
    const handleSubmit = async (formData: CarFormData) => {
        setIsLoading(true);
        try {
            await dispatch(createCar(formData)).unwrap();
            Alert.alert('Success', 'Car created successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create car');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>Add New Car</Title>
                    <Text style={styles.subtitle}>Fill in the details to add a new car</Text>
                    
                    <Divider style={styles.divider} />

                    <CarForm 
                        onSubmit={handleSubmit} 
                        isLoading={isLoading || isUsersLoading} 
                        drivers={drivers}
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

export default AddCarScreen;
