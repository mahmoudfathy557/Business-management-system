import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';

const EditProductScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Edit Product</Title>
                    <Text>Edit product form will be implemented here.</Text>
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
});

export default EditProductScreen;
