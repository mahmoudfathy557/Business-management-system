import React, { Component, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title, Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: any;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });

        // You can also log the error to an error reporting service here
        // logErrorToService(error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={styles.container}>
                    <Card style={styles.errorCard}>
                        <Card.Content style={styles.content}>
                            <View style={styles.iconContainer}>
                                <MaterialIcons name="error-outline" size={64} color="#f44336" />
                            </View>

                            <Title style={styles.title}>Something went wrong</Title>

                            <Text style={styles.message}>
                                We're sorry, but something unexpected happened. Please try again.
                            </Text>

                            {__DEV__ && this.state.error && (
                                <View style={styles.debugContainer}>
                                    <Text style={styles.debugTitle}>Debug Information:</Text>
                                    <Text style={styles.debugText}>
                                        {this.state.error.toString()}
                                    </Text>
                                    {this.state.errorInfo && (
                                        <Text style={styles.debugText}>
                                            {this.state.errorInfo.componentStack}
                                        </Text>
                                    )}
                                </View>
                            )}

                            <View style={styles.buttonContainer}>
                                <Button
                                    mode="contained"
                                    onPress={this.handleRetry}
                                    style={styles.retryButton}
                                    icon="refresh"
                                >
                                    Try Again
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorCard: {
        width: '100%',
        maxWidth: 400,
        elevation: 4,
    },
    content: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    iconContainer: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 20,
    },
    debugContainer: {
        width: '100%',
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    debugTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    debugText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'monospace',
        lineHeight: 16,
    },
    buttonContainer: {
        width: '100%',
    },
    retryButton: {
        marginTop: 8,
    },
});

export default ErrorBoundary;
