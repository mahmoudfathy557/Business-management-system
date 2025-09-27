import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
 
 import { fetchDashboardSummary } from '../../redux/slices';
import { AppDispatch, RootState } from '../../redux/store';
import { DashboardHeader, SummaryCards, LowStockAlerts, QuickActions, OverviewStats } from '../../components/Dashboard';

const DashboardScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const { summary, isLoading } = useSelector((state: RootState) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardSummary());
    }, [dispatch]);

    const onRefresh = () => {
        dispatch(fetchDashboardSummary());
    };


    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
                }
            >
                <DashboardHeader user={user} />
                <SummaryCards summary={summary} />
                <LowStockAlerts lowStockProducts={summary?.lowStockProducts || null} />
                <QuickActions userRole={user?.role || null} />
                <OverviewStats summary={summary} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
});

export default DashboardScreen;
