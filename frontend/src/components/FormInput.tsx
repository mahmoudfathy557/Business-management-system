import React from 'react';
import { View, StyleSheet, TextInputProps } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';

interface FormInputProps extends TextInputProps {
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    error,
    helperText,
    required = false,
    ...props
}) => {
    return (
        <View style={styles.container}>
            <TextInput
                label={`${label}${required ? ' *' : ''}`}
                mode="outlined"
                error={!!error}
                style={styles.input}
                {...props}
            />
            {(error || helperText) && (
                <HelperText type={error ? 'error' : 'info'} visible={!!(error || helperText)}>
                    {error || helperText}
                </HelperText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: 'white',
    },
});

export default FormInput;
