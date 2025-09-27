import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface DashboardSummary {
    totalProducts: number;
    totalCars: number;
    activeDrivers: number;
}

interface OverviewStatsProps {
    summary: DashboardSummary | null;
}

const OverviewStats: React.FC<OverviewStatsProps> = ({ summary }) => {
    if (!summary) return null;

    return (
        <Card style={styles.statsCard}>
            <Card.Content>
                <Title>Overview</Title>
                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <MaterialIcons name="inventory" size={24} color="#4caf50" />
                        <Text style={styles.statValue}>{summary.totalProducts}</Text>
                        <Text style={styles.statLabel}>Products</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialIcons name="directions-car" size={24} color="#2196f3" />
                        <Text style={styles.statValue}>{summary.totalCars}</Text>
                        <Text style={styles.statLabel}>Cars</Text>
                    </View>
                    <View style={styles.statItem}>
                        <MaterialIcons name="people" size={24} color="#ff9800" />
                        <Text style={styles.statValue}>{summary.activeDrivers}</Text>
                        <Text style={styles.statLabel}>Drivers</Text>
                    </View>
                </View>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    statsCard: {
        margin: 16,
        marginBottom: 100,
        elevation: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
});

export default OverviewStats;
