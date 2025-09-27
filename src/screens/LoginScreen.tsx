import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { loginUser, registerUser, clearError } from '../redux/slices';
import FormInput from '../components/FormInput';
import { UserRole } from '../types';

const LoginScreen: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.DRIVER);

    const dispatch = useDispatch<AppDispatch>();
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const handleSubmit = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (!isLogin && !name) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        dispatch(clearError());

        if (isLogin) {
            dispatch(loginUser({ email, password }));
        } else {
            dispatch(registerUser({ email, password, name, role }));
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        dispatch(clearError());
        setEmail('');
        setPassword('');
        setName('');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>
                            {isLogin ? 'Login' : 'Register'}
                        </Title>
                        <Paragraph style={styles.subtitle}>
                            {isLogin
                                ? 'Welcome back to Mobile Accessories Management'
                                : 'Create your account to get started'
                            }
                        </Paragraph>

                        <FormInput
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            required
                        />

                        <FormInput
                            label="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            required
                        />

                        {!isLogin && (
                            <>
                                <FormInput
                                    label="Full Name"
                                    value={name}
                                    onChangeText={setName}
                                    required
                                />

                                <View style={styles.roleContainer}>
                                    <Text style={styles.roleLabel}>Role *</Text>
                                    <View style={styles.roleButtons}>
                                        {Object.values(UserRole).map((userRole) => (
                                            <Button
                                                key={userRole}
                                                mode={role === userRole ? 'contained' : 'outlined'}
                                                onPress={() => setRole(userRole)}
                                                style={styles.roleButton}
                                                compact
                                            >
                                                {userRole.replace('_', ' ').toUpperCase()}
                                            </Button>
                                        ))}
                                    </View>
                                </View>
                            </>
                        )}

                        {error && (
                            <Text style={styles.errorText}>{error}</Text>
                        )}

                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            loading={isLoading}
                            disabled={isLoading}
                            style={styles.submitButton}
                        >
                            {isLogin ? 'Login' : 'Register'}
                        </Button>

                        <Button
                            mode="text"
                            onPress={toggleMode}
                            style={styles.toggleButton}
                        >
                            {isLogin
                                ? "Don't have an account? Register"
                                : 'Already have an account? Login'
                            }
                        </Button>
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        elevation: 4,
    },
    title: {
        textAlign: 'center',
        marginBottom: 8,
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 24,
        color: '#666',
    },
    roleContainer: {
        marginBottom: 16,
    },
    roleLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    roleButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    roleButton: {
        flex: 1,
        minWidth: 100,
    },
    errorText: {
        color: '#f44336',
        textAlign: 'center',
        marginBottom: 16,
    },
    submitButton: {
        marginTop: 16,
        paddingVertical: 8,
    },
    toggleButton: {
        marginTop: 8,
    },
});

export default LoginScreen;
