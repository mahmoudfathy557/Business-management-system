import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface CarsEmptyStateProps {
    hasSearchQuery: boolean;
}

const CarsEmptyState: React.FC<CarsEmptyStateProps> = ({ hasSearchQuery }) => {
    return (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cars found</Text>
            <Text style={styles.emptySubtext}>
                {hasSearchQuery ? 'Try adjusting your search terms' : 'Add your first car to get started'}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default CarsEmptyState;
