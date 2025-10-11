import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Divider, ActivityIndicator, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { createCar, updateCar, fetchCars } from '../../redux/slices/carsSlice';
import { fetchUsers } from '../../redux/slices/usersSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { CarFormData, RootStackParamList, UserRole } from '../../types';
import CarForm from '../../components/Cars/CarForm';

type SaveCarRouteProp = RouteProp<RootStackParamList, 'SaveCar'>;

const SaveCarScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const route = useRoute<SaveCarRouteProp>();
    const carId = route.params?.car; // carId can be undefined for AddCar
    const isEdit = !!carId;

    const { cars, isLoading: isCarsLoading } = useSelector((state: RootState) => state.cars);
    const { users: allUsers, isLoading: isUsersLoading } = useSelector((state: RootState) => state.users);
    const drivers = allUsers.filter(user => user.role === UserRole.DRIVER);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const selectedCar = cars.find(c => c._id === carId);

    useEffect(() => {
        if (isEdit && !selectedCar && !isCarsLoading) {
            dispatch(fetchCars());
        }
        dispatch(fetchUsers());
    }, [dispatch, isEdit, selectedCar, isCarsLoading]);

    const handleSubmit = async (formData: CarFormData) => {
        setIsSubmitting(true);
        try {
            if (isEdit) {
                await dispatch(updateCar({ id: carId, data: formData })).unwrap();
                Alert.alert('Success', 'Car updated successfully');
            } else {
                await dispatch(createCar(formData)).unwrap();
                Alert.alert('Success', 'Car created successfully');
            }
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message || `Failed to ${isEdit ? 'update' : 'create'} car`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isCarsLoading && isEdit) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading car...</Text>
            </View>
        );
    }

    if (isEdit && !selectedCar) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Car not found</Text>
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
                    <Title style={styles.title}>{isEdit ? 'Edit Car' : 'Add New Car'}</Title>
                    <Text style={styles.subtitle}>
                        {isEdit ? 'Update the car information below' : 'Fill in the details to add a new car'}
                    </Text>
                    
                    <Divider style={styles.divider} />

                    <CarForm 
                        onSubmit={handleSubmit} 
                        initialValues={selectedCar}
                        isEdit={isEdit} 
                        isLoading={isSubmitting || isUsersLoading} 
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

export default SaveCarScreen;