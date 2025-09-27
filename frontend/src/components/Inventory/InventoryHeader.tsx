import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Searchbar } from 'react-native-paper';

interface InventoryHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    totalProducts: number;
    lowStockCount: number;
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({
    searchQuery,
    onSearchChange,
    totalProducts,
    lowStockCount,
}) => {
    return (
        <View style={styles.header}>
            <Searchbar
                placeholder="Search products..."
                onChangeText={onSearchChange}
                value={searchQuery}
                style={styles.searchbar}
            />

            <View style={styles.statsContainer}>
                <Card style={styles.statsCard}>
                    <Card.Content style={styles.statsContent}>
                        <Text style={styles.statsValue}>{totalProducts}</Text>
                        <Text style={styles.statsLabel}>Total Products</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.statsCard}>
                    <Card.Content style={styles.statsContent}>
                        <Text style={styles.statsValue}>{lowStockCount}</Text>
                        <Text style={styles.statsLabel}>Low Stock</Text>
                    </Card.Content>
                </Card>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default InventoryHeader;
