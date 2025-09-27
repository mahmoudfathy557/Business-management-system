import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Chip, IconButton } from 'react-native-paper';
import { Car } from '../../types';

interface CarCardProps {
    car: Car;
    onPress: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean;
}

const CarCard: React.FC<CarCardProps> = ({
    car,
    onPress,
    onEdit,
    onDelete,
    showActions = false,
}) => {
    const assignedProductsCount = car.assignedProducts?.length || 0;

    return (
        <Card style={styles.card} onPress={onPress}>
            <Card.Content>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Title style={styles.title}>{car.plateNumber}</Title>
                        <Chip mode="outlined" style={styles.yearChip}>
                            {car.year}
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

                <Paragraph style={styles.model}>{car.model}</Paragraph>

                <View style={styles.details}>
                    <View style={styles.driverContainer}>
                        <Paragraph style={styles.driverLabel}>Driver:</Paragraph>
                        <Paragraph style={styles.driverName}>
                            {car.driver?.name || 'Unassigned'}
                        </Paragraph>
                    </View>

                    <View style={styles.productsContainer}>
                        <Paragraph style={styles.productsLabel}>Products:</Paragraph>
                        <Chip
                            mode="outlined"
                            style={styles.productsChip}
                            textStyle={styles.productsText}
                        >
                            {assignedProductsCount}
                        </Chip>
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    yearChip: {
        backgroundColor: '#e3f2fd',
    },
    actions: {
        flexDirection: 'row',
    },
    model: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    driverContainer: {
        flex: 1,
    },
    driverLabel: {
        fontSize: 12,
        color: '#666',
    },
    driverName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#2e7d32',
    },
    productsContainer: {
        alignItems: 'flex-end',
    },
    productsLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    productsChip: {
        backgroundColor: '#e8f5e8',
    },
    productsText: {
        color: '#2e7d32',
        fontSize: 12,
    },
});

export default CarCard;
