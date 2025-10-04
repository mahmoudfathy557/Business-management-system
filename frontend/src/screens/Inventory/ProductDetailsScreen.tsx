import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { Text, Card, Title, Button, Divider, Chip, IconButton, ActivityIndicator, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { deleteProduct, fetchProducts } from '../../redux/slices';
import { AppDispatch, RootState } from '../../redux/store';
import { RootStackParamList } from '../../types';

type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const route = useRoute<ProductDetailsRouteProp>();
    const { productId } = route.params;

    const { products, isLoading } = useSelector((state: RootState) => state.products);
    const { user } = useSelector((state: RootState) => state.auth);
    const [isDeleting, setIsDeleting] = useState(false);

    const product = products.find(p => p._id === productId);

    useEffect(() => {
        if (!product && !isLoading) {
            // Product not found, fetch products if not already loaded
            dispatch(fetchProducts({ page: 1, limit: 100 }));
        }
    }, [product, dispatch, isLoading]);

    const handleEdit = () => {
        (navigation as any).navigate('EditProduct', { productId });
    };

    const handleDelete = () => {
        Alert.alert(
            'Delete Product',
            'Are you sure you want to delete this product? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setIsDeleting(true);
                        try {
                            await dispatch(deleteProduct(productId)).unwrap();
                            Alert.alert('Success', 'Product deleted successfully', [
                                { text: 'OK', onPress: () => navigation.goBack() }
                            ]);
                        } catch (error: any) {
                            Alert.alert('Error', error.message || 'Failed to delete product');
                        } finally {
                            setIsDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    const handleStockUpdate = () => {
        // Navigate to stock update screen or show modal
        Alert.alert('Stock Update', 'Stock update functionality will be implemented here');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const isLowStock = product ? product.stockQuantity <= product.minStockLevel : false;
    const profitMargin = product ? ((product.price - product.cost) / product.price * 100) : 0;

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading product details...</Text>
            </View>
        );
    }

    if (!product) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Product not found</Text>
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
                            <Title style={styles.title}>{product.name}</Title>
                            <Chip
                                mode="outlined"
                                style={[
                                    styles.categoryChip,
                                    { backgroundColor: isLowStock ? '#ffebee' : '#e8f5e8' }
                                ]}
                                textStyle={{ color: isLowStock ? '#c62828' : '#2e7d32' }}
                            >
                                {product.category}
                            </Chip>
                        </View>

                        {isLowStock && (
                            <Chip
                                mode="outlined"
                                style={styles.lowStockChip}
                                textStyle={styles.lowStockText}
                                icon="alert"
                            >
                                Low Stock Alert
                            </Chip>
                        )}

                        <Divider style={styles.divider} />

                        <Text style={styles.description}>{product.description}</Text>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Pricing Information</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Selling Price:</Text>
                                <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Cost Price:</Text>
                                <Text style={styles.cost}>${product.cost.toFixed(2)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Profit Margin:</Text>
                                <Text style={[styles.margin, { color: profitMargin >= 0 ? '#2e7d32' : '#c62828' }]}>
                                    {profitMargin.toFixed(1)}%
                                </Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Inventory Information</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Current Stock:</Text>
                                <Text style={[styles.stock, { color: isLowStock ? '#c62828' : '#2e7d32' }]}>
                                    {product.stockQuantity} units
                                </Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Minimum Stock Level:</Text>
                                <Text style={styles.value}>{product.minStockLevel} units</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Status:</Text>
                                <Chip
                                    mode="outlined"
                                    style={[
                                        styles.statusChip,
                                        { backgroundColor: product.isActive ? '#e8f5e8' : '#ffebee' }
                                    ]}
                                    textStyle={{ color: product.isActive ? '#2e7d32' : '#c62828' }}
                                >
                                    {product.isActive ? 'Active' : 'Inactive'}
                                </Chip>
                            </View>
                        </View>

                        {product.barcode && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Product Code</Text>
                                <View style={styles.barcodeContainer}>
                                    <Text style={styles.barcode}>{product.barcode}</Text>
                                    <IconButton
                                        icon="content-copy"
                                        size={20}
                                        onPress={() => {
                                            // Copy to clipboard functionality would go here
                                            Alert.alert('Copied', 'Barcode copied to clipboard');
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Timestamps</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Created:</Text>
                                <Text style={styles.value}>{formatDate(product.createdAt)}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.label}>Last Updated:</Text>
                                <Text style={styles.value}>{formatDate(product.updatedAt)}</Text>
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                mode="outlined"
                                onPress={handleStockUpdate}
                                icon="package-variant"
                                style={styles.actionButton}
                            >
                                Update Stock
                            </Button>
                            <Button
                                mode="outlined"
                                onPress={() => {
                                    // Navigate to stock movements history
                                    Alert.alert('Stock History', 'Stock movements history will be implemented here');
                                }}
                                icon="history"
                                style={styles.actionButton}
                            >
                                Stock History
                            </Button>
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
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    categoryChip: {
        alignSelf: 'flex-start',
    },
    lowStockChip: {
        backgroundColor: '#ffebee',
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    lowStockText: {
        color: '#c62828',
        fontSize: 12,
    },
    divider: {
        marginVertical: 16,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        marginBottom: 16,
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
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    cost: {
        fontSize: 14,
        color: '#666',
    },
    margin: {
        fontSize: 14,
        fontWeight: '500',
    },
    stock: {
        fontSize: 14,
        fontWeight: '500',
    },
    statusChip: {
        alignSelf: 'flex-end',
    },
    barcodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    barcode: {
        fontSize: 16,
        fontFamily: 'monospace',
        color: '#333',
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    actionButton: {
        flex: 1,
        marginHorizontal: 4,
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

export default ProductDetailsScreen;
