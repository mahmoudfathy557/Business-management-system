import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import FormInput from '../FormInput';
import { UserRole } from '../../types';

interface LoginFormProps {
    isLogin: boolean;
    email: string;
    password: string;
    name: string;
    role: UserRole;
    isLoading: boolean;
    error: string | null;
    onEmailChange: (email: string) => void;
    onPasswordChange: (password: string) => void;
    onNameChange: (name: string) => void;
    onRoleChange: (role: UserRole) => void;
    onSubmit: () => void;
    onToggleMode: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    isLogin,
    email,
    password,
    name,
    role,
    isLoading,
    error,
    onEmailChange,
    onPasswordChange,
    onNameChange,
    onRoleChange,
    onSubmit,
    onToggleMode,
}) => {
    return (
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
                    onChangeText={onEmailChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    required
                />

                <FormInput
                    label="Password"
                    value={password}
                    onChangeText={onPasswordChange}
                    secureTextEntry
                    required
                />

                {!isLogin && (
                    <>
                        <FormInput
                            label="Full Name"
                            value={name}
                            onChangeText={onNameChange}
                            required
                        />

                        <View style={styles.roleContainer}>
                            <Text style={styles.roleLabel}>Role *</Text>
                            <View style={styles.roleButtons}>
                                {Object.values(UserRole).map((userRole) => (
                                    <Button
                                        key={userRole}
                                        mode={role === userRole ? 'contained' : 'outlined'}
                                        onPress={() => onRoleChange(userRole)}
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
                    onPress={onSubmit}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.submitButton}
                >
                    {isLogin ? 'Login' : 'Register'}
                </Button>

                <Button
                    mode="text"
                    onPress={onToggleMode}
                    style={styles.toggleButton}
                >
                    {isLogin
                        ? "Don't have an account? Register"
                        : 'Already have an account? Login'
                    }
                </Button>
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
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

export default LoginForm;
