import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, IconButton, Menu, Divider } from 'react-native-paper';
import { User } from '../../types';
import { useNavigation } from '@react-navigation/native';

interface UserCardProps {
    user: User;
    onPress: () => void;
    onEdit: () => void;
    onDelete: () => void;
    showActions: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress, onEdit, onDelete, showActions }) => {
    const navigation = useNavigation();
    const [menuVisible, setMenuVisible] = React.useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
        <TouchableOpacity onPress={onPress} style={styles.touchable}>
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.contentRow}>
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{user.name}</Text>
                            <Text style={styles.email}>{user.email}</Text>
                            <Text style={styles.role}>Role: {user.role}</Text>
                            <Text style={styles.status}>Status: {user.isActive ? 'Active' : 'Inactive'}</Text>
                        </View>
                        {showActions && (
                            <Menu
                                visible={menuVisible}
                                onDismiss={closeMenu}
                                anchor={<IconButton icon="dots-vertical" onPress={openMenu} />}>
                                <Menu.Item onPress={() => { closeMenu(); onEdit(); }} title="Edit" />
                                <Divider />
                                <Menu.Item onPress={() => { closeMenu(); onDelete(); }} title="Delete" />
                            </Menu>
                        )}
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchable: {
        marginVertical: 8,
        marginHorizontal: 16,
    },
    card: {
        elevation: 2,
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    role: {
        fontSize: 14,
        color: '#666',
    },
    status: {
        fontSize: 14,
        color: '#666',
    },
});

export default UserCard;
