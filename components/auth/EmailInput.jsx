import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function EmailInput({ value, onChangeText, editable = true }) {
    return (
        <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={editable}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1f2937',
    },
});