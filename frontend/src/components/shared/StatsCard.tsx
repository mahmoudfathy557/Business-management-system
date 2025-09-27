import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

interface StatsCardProps {
    value: string | number;
    label: string;
    style?: any;
}

const StatsCard: React.FC<StatsCardProps> = ({ value, label, style }) => {
    return (
        <Card style={[styles.statsCard, style]}>
            <Card.Content style={styles.statsContent}>
                <Text style={styles.statsValue}>{value}</Text>
                <Text style={styles.statsLabel}>{label}</Text>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
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

export default StatsCard;
