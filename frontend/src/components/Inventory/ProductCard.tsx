import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Chip, IconButton } from 'react-native-paper';
import { Product } from '../../types';

interface ProductCardProps {
    product: Product;
    onPress: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    onPress,
    onEdit,
    onDelete,
    showActions = false,
}) => {
    const isLowStock = product.stockQuantity <= product.minStockLevel;

    return (
        <Card style={styles.card} onPress={onPress}>
            <Card.Content>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
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
                    {showActions && (
                        <View style={styles.actions}>
                            {onEdit && (
                                <IconButton
                                    icon="pencil"
                                    size={20}
                                    onPress={onEdit}
                                />
                            )}
                            {onDelete && (
                                <IconButton
                                    icon="delete"
                                    size={20}
                                    onPress={onDelete}
                                />
                            )}
                        </View>
                    )}
                </View>

                <Paragraph style={styles.description} numberOfLines={2}>
                    {product.description}
                </Paragraph>

                <View style={styles.details}>
                    <View style={styles.priceContainer}>
                        <Paragraph style={styles.price}>${product.price.toFixed(2)}</Paragraph>
                        <Paragraph style={styles.cost}>Cost: ${product.cost.toFixed(2)}</Paragraph>
                    </View>

                    <View style={styles.stockContainer}>
                        <Paragraph style={[
                            styles.stock,
                            { color: isLowStock ? '#c62828' : '#2e7d32' }
                        ]}>
                            Stock: {product.stockQuantity}
                        </Paragraph>
                        {isLowStock && (
                            <Chip
                                mode="outlined"
                                style={styles.lowStockChip}
                                textStyle={styles.lowStockText}
                            >
                                Low Stock
                            </Chip>
                        )}
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 4,
        marginHorizontal: 8,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    categoryChip: {
        alignSelf: 'flex-start',
    },
    actions: {
        flexDirection: 'row',
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flex: 1,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    cost: {
        fontSize: 12,
        color: '#666',
    },
    stockContainer: {
        alignItems: 'flex-end',
    },
    stock: {
        fontSize: 14,
        fontWeight: '500',
    },
    lowStockChip: {
        backgroundColor: '#ffebee',
        marginTop: 4,
    },
    lowStockText: {
        color: '#c62828',
        fontSize: 10,
    },
});

export default ProductCard;
