import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Button, Divider, Chip, ActivityIndicator, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { deleteCar, fetchCars } from '../../redux/slices/carsSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { RootStackParamList } from '../../types';

type CarDetailsRouteProp = RouteProp<RootStackParamList, 'CarDetails'>;

const CarDetailsScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const route = useRoute<CarDetailsRouteProp>();
    const { carId } = route.params;

    const { cars, isLoading } = useSelector((state: RootState) => state.cars);
    const { user } = useSelector((state: RootState) => state.auth);
    const [isDeleting, setIsDeleting] = useState(false);

    const car = cars.find(c => c._id === carId);

    useEffect(() => {
        if (!car && !isLoading) {
            dispatch(fetchCars());
        }
    }, [car, dispatch, isLoading]);

    const handleEdit = () => {
        (navigation as any).navigate('EditCar', { carId });
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Car',
            'Are you sure you want to delete this car? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setIsDeleting(true);
                        try {
                            await dispatch(deleteCar(carId)).unwrap();
                            Alert.alert('Success', 'Car deleted successfully', [
                                { text: 'OK', onPress: () => navigation.goBack() }
                            ]);
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete car');
                        } finally {
                            setIsDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading car details...</Text>
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
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.header}>
                            <Title style={styles.title}>{`${car.year} ${car.model}`}</Title>
                            <Chip mode="outlined" style={styles.statusChip}>
                                {car.plateNumber}
                            </Chip>
                        </View>

                        <Divider style={styles.divider} />

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Car Information</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Plate Number:</Text>
                                <Text style={styles.value}>{car.plateNumber}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Model:</Text>
                                <Text style={styles.value}>{car.model}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Year:</Text>
                                <Text style={styles.value}>{car.year}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Driver:</Text>
                                <Text style={styles.value}>{car.driver?.name || 'Not Assigned'}</Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Timestamps</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Created:</Text>
                                <Text style={styles.value}>{formatDate(car.createdAt)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Last Updated:</Text>
                                <Text style={styles.value}>{formatDate(car.updatedAt)}</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>

            {(user?.role === 'admin' || user?.role === 'inventory_manager') && (
                <View style={styles.fabContainer}>
                    <FAB
                        icon="pencil"
                        style={styles.editFab}
                        onPress={handleEdit}
                    />
                    <FAB
                        icon="delete"
                        style={styles.deleteFab}
                        onPress={handleDelete}
                        loading={isDeleting}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    card: {
        margin: 16,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    statusChip: {
        alignSelf: 'flex-start',
    },
    divider: {
        marginVertical: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    fabContainer: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        flexDirection: 'column',
    },
    editFab: {
        marginBottom: 8,
        backgroundColor: '#6200ea',
    },
    deleteFab: {
        backgroundColor: '#c62828',
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

export default CarDetailsScreen;
