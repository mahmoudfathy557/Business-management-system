import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Searchbar } from 'react-native-paper';

interface CarsHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    totalCars: number;
    assignedCars: number;
    unassignedCars: number;
}

const CarsHeader: React.FC<CarsHeaderProps> = ({
    searchQuery,
    onSearchChange,
    totalCars,
    assignedCars,
    unassignedCars,
}) => {
    return (
        <View style={styles.header}>
            <Searchbar
                placeholder="Search cars..."
                onChangeText={onSearchChange}
                value={searchQuery}
                style={styles.searchbar}
            />

            <View style={styles.statsContainer}>
                <Card style={styles.statsCard}>
                    <Card.Content style={styles.statsContent}>
                        <Text style={styles.statsValue}>{totalCars}</Text>
                        <Text style={styles.statsLabel}>Total Cars</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.statsCard}>
                    <Card.Content style={styles.statsContent}>
                        <Text style={styles.statsValue}>{assignedCars}</Text>
                        <Text style={styles.statsLabel}>Assigned</Text>
                    </Card.Content>
                </Card>

                <Card style={styles.statsCard}>
                    <Card.Content style={styles.statsContent}>
                        <Text style={styles.statsValue}>{unassignedCars}</Text>
                        <Text style={styles.statsLabel}>Unassigned</Text>
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

export default CarsHeader;
