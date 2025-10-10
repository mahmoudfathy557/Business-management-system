import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Switch } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { User, UserRole, RegisterData } from '../../types';

interface UserFormProps {
    initialUser?: User;
    onSubmit: (userData: RegisterData | Partial<User>) => void;
    isLoading: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialUser, onSubmit, isLoading }) => {
    const [name, setName] = useState(initialUser?.name || '');
    const [email, setEmail] = useState(initialUser?.email || '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(initialUser?.role || UserRole.DRIVER);
    const [isActive, setIsActive] = useState(initialUser?.isActive ?? true);

    useEffect(() => {
        if (initialUser) {
            setName(initialUser.name);
            setEmail(initialUser.email);
            setRole(initialUser.role);
            setIsActive(initialUser.isActive);
        } else {
            setName('');
            setEmail('');
            setPassword('');
            setRole(UserRole.DRIVER);
            setIsActive(true);
        }
    }, [initialUser]);

    const handleSubmit = () => {
        if (!name || !email || (!initialUser && !password)) {
            Alert.alert('Validation Error', 'Please fill in all required fields.');
            return;
        }

        const userData: RegisterData | Partial<User> = initialUser
            ? { name, email, role, isActive }
            : { name, email, password, role, isActive } as RegisterData;

        onSubmit(userData);
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
                disabled={isLoading}
            />
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                disabled={isLoading}
            />
            {!initialUser && (
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    mode="outlined"
                    secureTextEntry
                    style={styles.input}
                    disabled={isLoading}
                />
            )}
            <Text style={styles.pickerLabel}>Role:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={role}
                    onValueChange={(itemValue: UserRole) => setRole(itemValue)}
                    style={styles.picker}
                    enabled={!isLoading}
                >
                    {Object.values(UserRole).map((r) => (
                        <Picker.Item key={r} label={r.replace(/_/g, ' ').toUpperCase()} value={r} />
                    ))}
                </Picker>
            </View>

            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>User is Active:</Text>
                <Switch
                    value={isActive}
                    onValueChange={setIsActive}
                    disabled={isLoading}
                />
            </View>

            <Button
                mode="contained"
                onPress={handleSubmit}
                loading={isLoading}
                disabled={isLoading}
                style={styles.button}
            >
                {initialUser ? 'Update User' : 'Create User'}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        width: '100%',
    },
    input: {
        marginBottom: 10,
    },
    pickerLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        marginTop: 10,
    },
    pickerContainer: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    button: {
        marginTop: 20,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 10,
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
    },
});

export default UserForm;
