import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchCars, deleteCar } from '../../redux/slices/carsSlice';
import CarCard from '../../components/Cars/CarCard';
import { CarsHeader, CarsEmptyState } from '../../components/Cars';
import { Car } from '../../types';

const CarsScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const { cars, isLoading } = useSelector((state: RootState) => state.cars);
    const { user } = useSelector((state: RootState) => state.auth);

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchCars());
    }, [dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchCars());
        setRefreshing(false);
    };

    const filteredCars = cars.filter(car =>
        car.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.driver?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteCar = (carId: string) => {
        Alert.alert(
            'Delete Car',
            'Are you sure you want to delete this car?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(deleteCar(carId));
                    },
                },
            ]
        );
    };

    const renderCar = ({ item }: { item: Car }) => (
        <CarCard
            car={item}
            onPress={() => (navigation as any).navigate('CarDetails' as never, { carId: item._id } as never)}
            onEdit={() => (navigation as any).navigate('EditCar'as never, { carId: item._id } as never)}
            onDelete={() => handleDeleteCar(item._id)}
            onNavigateToInventory={() => (navigation as any).navigate('CarInventory' as never, { carId: item._id } as never)}
            showActions={user?.role === 'admin'}
        />
    );

    const renderHeader = () => (
        <CarsHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            totalCars={cars.length}
            assignedCars={cars.filter(car => car.driver).length}
            unassignedCars={cars.filter(car => !car.driver).length}
        />
    );

    const renderEmpty = () => (
        <CarsEmptyState hasSearchQuery={!!searchQuery} />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredCars}
                renderItem={renderCar}
                keyExtractor={(item) => {
                     
                    return item._id}}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={styles.listContainer}
            />

            {user?.role === 'admin' && (
                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => navigation.navigate('AddCar' as never)}
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

export default CarsScreen;
