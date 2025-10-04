import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import FormInput from '../FormInput';
import { CarFormData } from '../../types';

interface CarFormProps {
    initialValues?: CarFormData;
    onSubmit: (formData: CarFormData) => void;
    isEdit?: boolean;
    isLoading?: boolean;
}

const CarForm: React.FC<CarFormProps> = ({ initialValues, onSubmit, isEdit = false, isLoading = false }) => {
    const [formData, setFormData] = useState<CarFormData>({
        plateNumber: initialValues?.plateNumber || '',
        model: initialValues?.model || '',
        year: initialValues?.year || new Date().getFullYear(),
        driverId: initialValues?.driverId || '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.plateNumber.trim()) {
            newErrors.plateNumber = 'Plate number is required';
        }

        if (!formData.model.trim()) {
            newErrors.model = 'Model is required';
        }

        if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
            newErrors.year = 'Please enter a valid year';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof CarFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <View style={styles.container}>
            <FormInput
                label="Plate Number"
                value={formData.plateNumber}
                onChangeText={(text) => handleInputChange('plateNumber', text)}
                error={errors.plateNumber}
                required
            />
            <FormInput
                label="Model"
                value={formData.model}
                onChangeText={(text) => handleInputChange('model', text)}
                error={errors.model}
                required
            />
            <FormInput
                label="Year"
                value={formData.year.toString()}
                onChangeText={(text) => handleInputChange('year', parseInt(text) || 0)}
                error={errors.year}
                keyboardType="numeric"
                required
            />
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.submitButton}
                >
                    {isEdit ? 'Update Car' : 'Add Car'}
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        marginTop: 24,
    },
    submitButton: {
        flex: 1,
    },
});

export default CarForm;
