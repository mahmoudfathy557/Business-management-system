import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Button, Switch, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { logoutUser } from '../../redux/slices';

const SettingsScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [lowStockAlerts, setLowStockAlerts] = React.useState(true);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Settings</Title>

                    <List.Item
                        title="User Information"
                        description={`${user?.name} (${user?.role?.replace('_', ' ').toUpperCase()})`}
                        left={(props) => <List.Icon {...props} icon="account" />}
                    />

                    <List.Item
                        title="Notifications"
                        description="Enable push notifications"
                        left={(props) => <List.Icon {...props} icon="bell" />}
                        right={() => (
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                            />
                        )}
                    />

                    <List.Item
                        title="Low Stock Alerts"
                        description="Get notified when stock is low"
                        left={(props) => <List.Icon {...props} icon="warning" />}
                        right={() => (
                            <Switch
                                value={lowStockAlerts}
                                onValueChange={setLowStockAlerts}
                            />
                        )}
                    />

                    <List.Item
                        title="Backup & Restore"
                        description="Manage your data"
                        left={(props) => <List.Icon {...props} icon="backup-restore" />}
                        onPress={() => { }}
                    />

                    <List.Item
                        title="About"
                        description="App version and information"
                        left={(props) => <List.Icon {...props} icon="information" />}
                        onPress={() => { }}
                    />

                    <Button
                        mode="contained"
                        onPress={handleLogout}
                        style={styles.logoutButton}
                        buttonColor="#f44336"
                    >
                        Logout
                    </Button>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    card: {
        elevation: 2,
    },
    logoutButton: {
        marginTop: 20,
    },
});

export default SettingsScreen;
