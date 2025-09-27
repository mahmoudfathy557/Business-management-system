import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { User } from '../../types';

interface DashboardHeaderProps {
    user: User | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <View style={styles.header}>
            <Text style={styles.greeting}>{getGreeting()}, {user?.name}!</Text>
            <Chip mode="outlined" style={styles.roleChip}>
                {user?.role?.replace('_', ' ').toUpperCase()}
            </Chip>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        elevation: 2,
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    roleChip: {
        backgroundColor: '#e3f2fd',
    },
});

export default DashboardHeader;
