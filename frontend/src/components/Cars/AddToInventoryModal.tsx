import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, FlatList, TextInput, Text } from 'react-native';
import { Button, Checkbox, Card, Title, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchProducts } from '../../redux/slices/productsSlice';
import { assignProductToCar } from '../../redux/slices/carsSlice';
import { Product } from '../../types';

interface Props {
    visible: boolean;
    onClose: () => void;
    car: string;
}

const AddToInventoryModal: React.FC<Props> = ({ visible, onClose, car }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { products } = useSelector((state: RootState) => state.products);
    const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (visible) {
            dispatch(fetchProducts({ limit: 1000 })); // Fetch all products
        }
    }, [dispatch, visible]);

    const handleSelectProduct = (productId: string) => {
        setSelectedProducts(prev => {
            const newSelection = { ...prev };
            if (newSelection[productId]) {
                delete newSelection[productId];
            } else {
                newSelection[productId] = 1;
            }
            return newSelection;
        });
    };

    const handleQuantityChange = (productId: string, quantity: string) => {
        const numQuantity = parseInt(quantity, 10);
        if (!isNaN(numQuantity) && numQuantity > 0) {
            setSelectedProducts(prev => ({ ...prev, [productId]: numQuantity }));
        }
    };

    const handleSave = () => {
        const products = Object.keys(selectedProducts).map(productId => ({
            productId,
            quantity: selectedProducts[productId],
        }));
        dispatch(assignProductToCar({ carId:car, data: { products } }));
        onClose();
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderProduct = ({ item }: { item: Product }) => (
        <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
                <Checkbox
                    status={selectedProducts[item._id] ? 'checked' : 'unchecked'}
                    onPress={() => handleSelectProduct(item._id)}
                />
                <View style={styles.productDetails}>
                    <Title>{item.name}</Title>
                    <Paragraph>In Stock: {item.stockQuantity}</Paragraph>
                </View>
                {selectedProducts[item._id] && (
                    <TextInput
                        style={styles.quantityInput}
                        keyboardType="numeric"
                        value={selectedProducts[item._id].toString()}
                        onChangeText={text => handleQuantityChange(item._id, text)}
                    />
                )}
            </Card.Content>
        </Card>
    );

    return (
        <Modal visible={visible} onRequestClose={onClose} animationType="slide">
            <View style={styles.container}>
                <Title>Add Products to Car</Title>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProduct}
                    keyExtractor={item => item._id}
                />
                <View style={styles.buttonContainer}>
                    <Button onPress={onClose}>Cancel</Button>
                    <Button onPress={handleSave} mode="contained">Save</Button>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        marginBottom: 16,
    },
    card: {
        marginVertical: 8,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productDetails: {
        flex: 1,
        marginLeft: 8,
    },
    quantityInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        width: 60,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
});

export default AddToInventoryModal;
