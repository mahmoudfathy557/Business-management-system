import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    children: React.ReactNode;
    padding?: number;
}

const ScrollableScreen: React.FC<Props> = ({ children, padding = 16 }) => (
    <SafeAreaView style={styles.safeArea}>
        <ScrollView
            contentContainerStyle={[styles.scrollContainer, { padding }]}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
        >
            {children}
        </ScrollView>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
    },
});

export default ScrollableScreen;
