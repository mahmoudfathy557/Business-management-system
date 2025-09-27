import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface LoadingProps {
    message?: string;
    size?: 'small' | 'large';
    color?: string;
}

const Loading: React.FC<LoadingProps> = ({
    message = 'Loading...',
    size = 'large',
    color = '#6200ea'
}) => {
    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content style={styles.content}>
                    <ActivityIndicator size={size} color={color} />
                    <Text style={styles.message}>{message}</Text>
                </Card.Content>
            </Card>
        </View>
    );
};

interface SkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius = 4
}) => {
    return (
        <View style={[
            styles.skeleton,
            { width, height, borderRadius }
        ]} />
    );
};

interface SkeletonCardProps {
    showAvatar?: boolean;
    lines?: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
    showAvatar = true,
    lines = 3
}) => {
    return (
        <Card style={styles.skeletonCard}>
            <Card.Content>
                <View style={styles.skeletonHeader}>
                    {showAvatar && <Skeleton width={50} height={50} borderRadius={25} />}
                    <View style={styles.skeletonTextContainer}>
                        <Skeleton width="80%" height={16} />
                        <Skeleton width="60%" height={14} style={{ marginTop: 8 }} />
                    </View>
                </View>

                <View style={styles.skeletonBody}>
                    {Array.from({ length: lines }).map((_, index) => (
                        <Skeleton
                            key={index}
                            width={`${100 - index * 10}%`}
                            height={14}
                            style={{ marginTop: index > 0 ? 8 : 16 }}
                        />
                    ))}
                </View>
            </Card.Content>
        </Card>
    );
};

interface LoadingOverlayProps {
    visible: boolean;
    message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
    visible,
    message = 'Loading...'
}) => {
    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <View style={styles.overlayContent}>
                <ActivityIndicator size="large" color="#6200ea" />
                <Text style={styles.overlayMessage}>{message}</Text>
            </View>
        </View>
    );
};

interface EmptyStateProps {
    icon?: string;
    title: string;
    message: string;
    actionText?: string;
    onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'inbox',
    title,
    message,
    actionText,
    onAction,
}) => {
    return (
        <View style={styles.emptyContainer}>
            <MaterialIcons name={icon as any} size={64} color="#ccc" />
            <Title style={styles.emptyTitle}>{title}</Title>
            <Text style={styles.emptyMessage}>{message}</Text>
            {actionText && onAction && (
                <Text style={styles.emptyAction} onPress={onAction}>
                    {actionText}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    card: {
        elevation: 2,
        minWidth: 200,
    },
    content: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    message: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    skeleton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
    },
    skeletonCard: {
        marginVertical: 4,
        marginHorizontal: 8,
        elevation: 1,
    },
    skeletonHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    skeletonTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    skeletonBody: {
        marginTop: 16,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    overlayContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 4,
    },
    overlayMessage: {
        marginTop: 12,
        fontSize: 16,
        color: '#333',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        lineHeight: 20,
    },
    emptyAction: {
        fontSize: 16,
        color: '#6200ea',
        marginTop: 16,
        fontWeight: '500',
    },
});

export { Loading, Skeleton, SkeletonCard, LoadingOverlay, EmptyState };
