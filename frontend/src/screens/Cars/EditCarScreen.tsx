import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { updateCar, fetchCars } from '../../redux/slices/carsSlice';
import { fetchUsers } from '../../redux/slices/usersSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { CarFormData, RootStackParamList, UserRole } from '../../types';
import CarForm from '../../components/Cars/CarForm';

type EditCarRouteProp = RouteProp<RootStackParamList, 'EditCar'>;

const EditCarScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const route = useRoute<EditCarRouteProp>();
    const carId = route.params?.carId;

    if (!carId) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Car ID is missing. Cannot edit car.</Text>
                <Button mode="contained" onPress={() => navigation.goBack()}>
                    Go Back
                </Button>
            </View>
        );
    }

    const { cars, isLoading } = useSelector((state: RootState) => state.cars);
    const { users: allUsers, isLoading: isUsersLoading } = useSelector((state: RootState) => state.users);
    const drivers = allUsers.filter(user => user.role === UserRole.DRIVER);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const car = cars.find(c => c._id === carId);

    useEffect(() => {
        if (!car && !isLoading) {
            dispatch(fetchCars());
        }
        dispatch(fetchUsers());
    }, [car, dispatch, isLoading]);

    const handleSubmit = async (formData: CarFormData) => {
        setIsSubmitting(true);
        try {
            await dispatch(updateCar({ id: carId, data: formData })).unwrap();
            Alert.alert('Success', 'Car updated successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update car');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading car...</Text>
            </View>
        );
    }

    if (!car) {
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
                    <Title style={styles.title}>Edit Car</Title>
                    <Text style={styles.subtitle}>Update the car information below</Text>
                    
                    <Divider style={styles.divider} />

                    <CarForm 
                        onSubmit={handleSubmit} 
                        initialValues={car}
                        isEdit 
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

export default EditCarScreen;
