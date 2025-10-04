import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Button, Divider } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import FormInput from '../../components/FormInput';
import { createProduct } from '../../redux/slices';
import { AppDispatch } from '../../redux/store';
import { ProductFormData } from '../../types';

const AddProductScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: '',
        category: '',
        price: 0,
        cost: 0,
        stockQuantity: 0,
        minStockLevel: 5,
        barcode: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.category.trim()) {
            newErrors.category = 'Category is required';
        }

        if (formData.price <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        if (formData.cost < 0) {
            newErrors.cost = 'Cost cannot be negative';
        }

        if (formData.stockQuantity < 0) {
            newErrors.stockQuantity = 'Stock quantity cannot be negative';
        }

        if (formData.minStockLevel < 0) {
            newErrors.minStockLevel = 'Minimum stock level cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof ProductFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(createProduct(formData)).unwrap();
            Alert.alert('Success', 'Product created successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to create product');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>Add New Product</Title>
                    <Text style={styles.subtitle}>Fill in the details to add a new product to inventory</Text>
                    
                    <Divider style={styles.divider} />

                    <FormInput
                        label="Product Name"
                        value={formData.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                        error={errors.name}
                        required
                    />

                    <FormInput
                        label="Description"
                        value={formData.description}
                        onChangeText={(text) => handleInputChange('description', text)}
                        error={errors.description}
                        multiline
                        numberOfLines={3}
                        required
                    />

                    <FormInput
                        label="Category"
                        value={formData.category}
                        onChangeText={(text) => handleInputChange('category', text)}
                        error={errors.category}
                        required
                    />

                    <View style={styles.row}>
                        <View style={styles.halfWidth}>
                            <FormInput
                                label="Price"
                                value={formData.price.toString()}
                                onChangeText={(text) => handleInputChange('price', parseFloat(text) || 0)}
                                error={errors.price}
                                keyboardType="numeric"
                                required
                            />
                        </View>
                        <View style={styles.halfWidth}>
                            <FormInput
                                label="Cost"
                                value={formData.cost.toString()}
                                onChangeText={(text) => handleInputChange('cost', parseFloat(text) || 0)}
                                error={errors.cost}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.halfWidth}>
                            <FormInput
                                label="Stock Quantity"
                                value={formData.stockQuantity.toString()}
                                onChangeText={(text) => handleInputChange('stockQuantity', parseInt(text) || 0)}
                                error={errors.stockQuantity}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.halfWidth}>
                            <FormInput
                                label="Min Stock Level"
                                value={formData.minStockLevel.toString()}
                                onChangeText={(text) => handleInputChange('minStockLevel', parseInt(text) || 0)}
                                error={errors.minStockLevel}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <FormInput
                        label="Barcode (Optional)"
                        value={formData.barcode || ''}
                        onChangeText={(text) => handleInputChange('barcode', text)}
                        error={errors.barcode}
                        keyboardType="numeric"
                    />

                    <View style={styles.buttonContainer}>
                        <Button
                            mode="outlined"
                            onPress={() => navigation.goBack()}
                            style={styles.cancelButton}
                        >
                            Cancel
                        </Button>
                        <Button
                            mode="contained"
                            onPress={handleSubmit}
                            loading={isLoading}
                            disabled={isLoading}
                            style={styles.submitButton}
                        >
                            Add Product
                        </Button>
                    </View>
                </Card.Content>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    card: {
        margin: 16,
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    divider: {
        marginVertical: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
    },
    submitButton: {
        flex: 1,
        marginLeft: 8,
    },
});

export default AddProductScreen;
