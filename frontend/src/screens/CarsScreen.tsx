import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Text, Card, Title, Searchbar, FAB, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch, RootState } from '../redux/store';
import { fetchCars, deleteCar } from '../redux/slices';
import CarCard from '../components/CarCard';
import { Car } from '../types';

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
            onPress={() => (navigation as any).navigate('CarDetails' as never, { carId: item.id } as never)}
            onEdit={() => (navigation as any).navigate('EditCar' as never, { carId: item.id } as never)}
            onDelete={() => handleDeleteCar(item.id)}
            showActions={user?.role === 'admin'}
        />
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <Searchbar
                placeholder="Search cars..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.searchbar}
            />

            <View style={styles.statsContainer}>
                <Card style={styles.statsCard}>
                    <Card.Content style={styles.statsContent}>
                        <Text style={styles.statsValue}>{cars.length}</Text>
                        <Text style={styles.statsLabel}>Total Cars</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.statsCard}>
                    <Card.Content style={styles.statsContent}>
                        <Text style={styles.statsValue}>
                            {cars.filter(car => car.driver).length}
                        </Text>
                        <Text style={styles.statsLabel}>Assigned</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.statsCard}>
                    <Card.Content style={styles.statsContent}>
                        <Text style={styles.statsValue}>
                            {cars.filter(car => !car.driver).length}
                        </Text>
                        <Text style={styles.statsLabel}>Unassigned</Text>
                    </Card.Content>
                </Card>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cars found</Text>
            <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try adjusting your search terms' : 'Add your first car to get started'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredCars}
                renderItem={renderCar}
                keyExtractor={(item) => item.id}
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
    header: {
        padding: 16,
        backgroundColor: 'white',
        elevation: 2,
    },
    searchbar: {
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    statsCard: {
        flex: 1,
        elevation: 1,
    },
    statsContent: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    statsValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    statsLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
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
