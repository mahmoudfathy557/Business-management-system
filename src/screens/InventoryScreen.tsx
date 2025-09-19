import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { Text, Card, Title, Searchbar, FAB, Button, Menu, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppDispatch, RootState } from '../redux/store';
import { fetchProducts, deleteProduct } from '../redux/slices';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

const InventoryScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const { products, isLoading, total } = useSelector((state: RootState) => state.products);
    const { user } = useSelector((state: RootState) => state.auth);

    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [menuVisible, setMenuVisible] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchProducts({ page: 1, limit: 20 }));
    }, [dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        setPage(1);
        await dispatch(fetchProducts({ page: 1, limit: 20, search: searchQuery }));
        setRefreshing(false);
    };

    const onSearch = (query: string) => {
        setSearchQuery(query);
        setPage(1);
        dispatch(fetchProducts({ page: 1, limit: 20, search: query }));
    };

    const loadMore = () => {
        if (products.length < total && !isLoading) {
            const nextPage = page + 1;
            setPage(nextPage);
            dispatch(fetchProducts({ page: nextPage, limit: 20, search: searchQuery }));
        }
    };

    const handleDeleteProduct = (productId: string) => {
        Alert.alert(
            'Delete Product',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(deleteProduct(productId));
                        setMenuVisible(null);
                    },
                },
            ]
        );
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetails' as never, { productId: item.id } as never)}
            onEdit={() => navigation.navigate('EditProduct' as never, { productId: item.id } as never)}
            onDelete={() => handleDeleteProduct(item.id)}
            showActions={user?.role === 'admin' || user?.role === 'inventory_manager'}
        />
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <Searchbar
                placeholder="Search products..."
                onChangeText={onSearch}
                value={searchQuery}
                style={styles.searchbar}
            />

            <View style={styles.statsContainer}>
                <Card style={styles.statsCard}>
                    <Card.Content style={styles.statsContent}>
                        <Text style={styles.statsValue}>{total}</Text>
                        <Text style={styles.statsLabel}>Total Products</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.statsCard}>
                    <Card.Content style={styles.statsContent}>
                        <Text style={styles.statsValue}>
                            {products.filter(p => p.stockQuantity <= p.minStockLevel).length}
                        </Text>
                        <Text style={styles.statsLabel}>Low Stock</Text>
                    </Card.Content>
                </Card>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>
                {searchQuery ? 'Try adjusting your search terms' : 'Add your first product to get started'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.1}
                contentContainerStyle={styles.listContainer}
            />

            {(user?.role === 'admin' || user?.role === 'inventory_manager') && (
                <FAB
                    style={styles.fab}
                    icon="plus"
                    onPress={() => navigation.navigate('AddProduct' as never)}
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
        fontSize: 20,
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

export default InventoryScreen;
