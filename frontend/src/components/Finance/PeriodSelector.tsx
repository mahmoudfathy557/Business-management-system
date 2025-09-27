import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Title, SegmentedButtons } from 'react-native-paper';

interface PeriodSelectorProps {
    selectedPeriod: string;
    onPeriodChange: (period: string) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, onPeriodChange }) => {
    return (
        <Card style={styles.periodCard}>
            <Card.Content>
                <Title>Select Period</Title>
                <SegmentedButtons
                    value={selectedPeriod}
                    onValueChange={onPeriodChange}
                    buttons={[
                        { value: 'today', label: 'Today' },
                        { value: 'week', label: 'This Week' },
                        { value: 'month', label: 'This Month' },
                        { value: 'year', label: 'This Year' },
                    ]}
                    style={styles.segmentedButtons}
                />
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    periodCard: {
        margin: 16,
        elevation: 2,
    },
    segmentedButtons: {
        marginTop: 12,
    },
});

export default PeriodSelector;
