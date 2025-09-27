import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface LowStockProduct {
    id: string;
    name: string;
    stockQuantity: number;
    minStockLevel: number;
}

interface LowStockAlertsProps {
    lowStockProducts: LowStockProduct[] | null;
}

const LowStockAlerts: React.FC<LowStockAlertsProps> = ({ lowStockProducts }) => {
    if (!lowStockProducts || lowStockProducts.length === 0) return null;

    return (
        <Card style={styles.alertCard}>
            <Card.Content>
                <Title style={styles.alertTitle}>
                    <MaterialIcons name="warning" size={20} color="#ff9800" />
                    {' '}Low Stock Alerts
                </Title>
                {lowStockProducts.slice(0, 3).map((product) => (
                    <View key={product.id} style={styles.alertItem}>
                        <Text style={styles.alertProduct}>{product.name}</Text>
                        <Text style={styles.alertStock}>
                            Stock: {product.stockQuantity} (Min: {product.minStockLevel})
                        </Text>
                    </View>
                ))}
                {lowStockProducts.length > 3 && (
                    <Text style={styles.alertMore}>
                        +{lowStockProducts.length - 3} more products
                    </Text>
                )}
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    alertCard: {
        margin: 16,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#ff9800',
    },
    alertTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    alertItem: {
        marginBottom: 8,
    },
    alertProduct: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    alertStock: {
        fontSize: 12,
        color: '#666',
    },
    alertMore: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 4,
    },
});

export default LowStockAlerts;
