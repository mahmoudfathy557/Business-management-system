import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { loginUser, registerUser, clearError } from '../../redux/slices';
import { LoginForm } from '../../components/Login';
import { UserRole } from '../../types';

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
                <LoginForm
                    isLogin={isLogin}
                    email={email}
                    password={password}
                    name={name}
                    role={role}
                    isLoading={isLoading}
                    error={error}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onNameChange={setName}
                    onRoleChange={setRole}
                    onSubmit={handleSubmit}
                    onToggleMode={toggleMode}
                />
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
});

export default LoginScreen;
