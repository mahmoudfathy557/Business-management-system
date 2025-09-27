import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import StatsContainer from './StatsContainer';

interface StatItem {
    value: string | number;
    label: string;
}

interface SearchHeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    placeholder: string;
    stats: StatItem[];
    style?: any;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
    searchQuery,
    onSearchChange,
    placeholder,
    stats,
    style,
}) => {
    return (
        <View style={[styles.header, style]}>
            <Searchbar
                placeholder={placeholder}
                onChangeText={onSearchChange}
                value={searchQuery}
                style={styles.searchbar}
            />
            <StatsContainer stats={stats} />
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
});

export default SearchHeader;
