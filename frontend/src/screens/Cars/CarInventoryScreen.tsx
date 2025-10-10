import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert, Text } from 'react-native';
import { FAB, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchCarById, removeProductFromCar } from '../../redux/slices/carsSlice';
import { Car, ProductAssignment } from '../../types';
import AddToInventoryModal from '../../components/Cars/AddToInventoryModal';

const CarInventoryScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const route = useRoute();
    const { carId } = route.params as { carId: string };

    const { selectedCar: car, isLoading } = useSelector((state: RootState) => state.cars);
    const { user } = useSelector((state: RootState) => state.auth);

    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (carId) {
            dispatch(fetchCarById(carId));
        }
    }, [dispatch, carId]);

    const onRefresh = async () => {
        setRefreshing(true);
        if (carId) {
            await dispatch(fetchCarById(carId));
        }
        setRefreshing(false);
    };

    const handleRemoveProduct = (productId: string) => {
        Alert.alert(
            'Remove Product',
            'Are you sure you want to remove this product from the car?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(removeProductFromCar({ carId, productId }));
                    },
                },
            ]
        );
    };

    const renderProduct = ({ item }: { item: ProductAssignment }) => (
        <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
                <View>
                    <Title>{item.productId.name}</Title>
                    <Paragraph>Quantity: {item.quantity}</Paragraph>
                </View>
                <IconButton
                    icon="delete"
                    onPress={() => handleRemoveProduct(item.productId._id)}
                />
            </Card.Content>
        </Card>
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <Title>{car?.model} - {car?.plateNumber}</Title>
            <Paragraph>Driver: {car?.driver?.name || 'Unassigned'}</Paragraph>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={car?.assignedProducts || []}
                renderItem={renderProduct}
                keyExtractor={(item) => item.productId._id }
                ListHeaderComponent={renderHeader}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                contentContainerStyle={styles.listContainer}
            />

            <AddToInventoryModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                carId={carId}
            />

            {user?.role === 'admin' && (
                <FAB
                    style={styles.fab}
                    icon="plus"
                    label="Add Products"
                    onPress={() => setModalVisible(true)}
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
    headerContainer: {
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    card: {
        marginHorizontal: 16,
        marginVertical: 8,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default CarInventoryScreen;
