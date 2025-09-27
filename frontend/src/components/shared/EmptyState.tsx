import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface EmptyStateProps {
    title: string;
    subtitle: string;
    style?: any;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, subtitle, style }) => {
    return (
        <View style={[styles.emptyContainer, style]}>
            <Text style={styles.emptyText}>{title}</Text>
            <Text style={styles.emptySubtext}>{subtitle}</Text>
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

export default EmptyState;
