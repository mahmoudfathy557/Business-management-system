import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Button, Divider, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import FormInput from '../../components/FormInput';
import { createProduct, updateProduct, fetchProducts } from '../../redux/slices';
import { AppDispatch, RootState } from '../../redux/store';
import { ProductFormData, RootStackParamList } from '../../types';

type SaveProductRouteProp = RouteProp<RootStackParamList, 'SaveProduct'>;

const SaveProductScreen: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const route = useRoute<SaveProductRouteProp>();
    const productId = route.params?.productId;
    const isEdit = !!productId;

    const { products, isLoading: isProductsLoading } = useSelector((state: RootState) => state.products);
    const [isSubmitting, setIsSubmitting] = useState(false);
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

    const selectedProduct = products.find(p => p._id === productId);

    useEffect(() => {
        if (isEdit && selectedProduct) {
            setFormData({
                name: selectedProduct.name,
                description: selectedProduct.description,
                category: selectedProduct.category,
                price: selectedProduct.price,
                cost: selectedProduct.cost,
                stockQuantity: selectedProduct.stockQuantity,
                minStockLevel: selectedProduct.minStockLevel,
                barcode: selectedProduct.barcode || '',
            });
        } else if (isEdit && !selectedProduct && !isProductsLoading) {
            dispatch(fetchProducts({ page: 1, limit: 100 }));
        }
    }, [selectedProduct, dispatch, isProductsLoading, isEdit]);

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
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEdit) {
                await dispatch(updateProduct({ id: productId, data: formData })).unwrap();
                Alert.alert('Success', 'Product updated successfully');
            } else {
                await dispatch(createProduct(formData)).unwrap();
                Alert.alert('Success', 'Product created successfully');
            }
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message || `Failed to ${isEdit ? 'update' : 'create'} product`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isProductsLoading && isEdit) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading product...</Text>
            </View>
        );
    }

    if (isEdit && !selectedProduct) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Product not found</Text>
                <Button mode="contained" onPress={() => navigation.goBack()}>
                    Go Back
                </Button>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>{isEdit ? 'Edit Product' : 'Add New Product'}</Title>
                    <Text style={styles.subtitle}>
                        {isEdit 
                            ? 'Update the product information below' 
                            : 'Fill in the details to add a new product to inventory'}
                    </Text>
                    
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
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            style={styles.submitButton}
                        >
                            {isEdit ? 'Update Product' : 'Add Product'}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    errorText: {
        fontSize: 18,
        color: '#c62828',
        marginBottom: 16,
        textAlign: 'center',
    },
});

export default SaveProductScreen;