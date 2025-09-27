import React from 'react';
import { View, StyleSheet } from 'react-native';
import StatsCard from './StatsCard';

interface StatItem {
    value: string | number;
    label: string;
}

interface StatsContainerProps {
    stats: StatItem[];
    style?: any;
}

const StatsContainer: React.FC<StatsContainerProps> = ({ stats, style }) => {
    return (
        <View style={[styles.statsContainer, style]}>
            {stats.map((stat, index) => (
                <StatsCard
                    key={index}
                    value={stat.value}
                    label={stat.label}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});

export default StatsContainer;
