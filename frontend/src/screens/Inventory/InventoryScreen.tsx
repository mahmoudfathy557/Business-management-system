import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { InventoryHeader, InventoryEmptyState } from '../../components/Inventory';
import { fetchProducts, deleteProduct } from '../../redux/slices';
import GenericTable, { MenuItem } from '../../components/GenericTable';
import { AppDispatch, RootState } from '../../redux/store';
import { Product } from '../../types';

const InventoryScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const { products, isLoading, total } = useSelector((state: RootState) => state.products);

    const columns = [
        { header: 'Name', accessor: 'name' as keyof Product },
        { header: 'Category', accessor: 'category' as keyof Product },
        { header: 'Price', accessor: 'price' as keyof Product },
        { header: 'Stock Quantity', accessor: 'stockQuantity' as keyof Product },
        { header: 'Min Stock Level', accessor: 'minStockLevel' as keyof Product },
    ];
    const { user } = useSelector((state: RootState) => state.auth);

    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [menuVisible, setMenuVisible] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchProducts({ page: 1, limit: 20 }));
    }, [dispatch]);

    const menuItems = (product: Product)=> {
        const items: MenuItem[] = [];
        if (user?.role === 'admin' || user?.role === 'inventory_manager') {
            items.push({
                title: 'Edit',
                onPress: () => (navigation as any).navigate('SaveProduct', { productId: product._id }),
            });
            items.push({
                title: 'Delete',
                onPress: () => handleDeleteProduct(product._id),
            });
        }
        items.push({
          title: 'Show Details',
          onPress: () => (navigation as any).navigate('ProductDetails', { productId: product._id }),
        });
          return items;
    };


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

    return (
        <View style={styles.container}>
            <InventoryHeader
                searchQuery={searchQuery}
                onSearchChange={onSearch}
                totalProducts={total}
                lowStockCount={products.length > 0 ? products.filter(p => p.stockQuantity <= p.minStockLevel).length : 0}
            />
            <GenericTable
                data={products}
                columns={columns}
                menuItems={menuItems}
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
