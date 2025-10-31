import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { InventoryHeader, InventoryEmptyState } from '../../components/Inventory';
import ProductCard from '../../components/Inventory/ProductCard';
import { fetchProducts, deleteProduct } from '../../redux/slices';
import { AppDispatch, RootState } from '../../redux/store';
import { Product } from '../../types';
 

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
            onPress={() => (navigation as any).navigate('ProductDetails', { productId: item._id })}
            onEdit={() => (navigation as any).navigate('SaveProduct', { productId: item._id })}
            onDelete={() => handleDeleteProduct(item._id)}
            showActions={user?.role === 'admin' || user?.role === 'inventory_manager'}
        />
    );

    const renderHeader = () => (
        <InventoryHeader
            searchQuery={searchQuery}
            onSearchChange={onSearch}
            totalProducts={total}
            lowStockCount={products.length > 0 ? products.filter(p => p.stockQuantity <= p.minStockLevel).length : 0}
        />
    );

    const renderEmpty = () => (
        <InventoryEmptyState hasSearchQuery={!!searchQuery} />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item._id}
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
                    onPress={() => navigation.navigate('SaveProduct' as never)}
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

export default InventoryScreen;
