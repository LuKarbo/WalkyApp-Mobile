import { StyleSheet, Text, TextInput, View } from 'react-native';

export default function ProfileFormFields({ fullName, onFullNameChange, phone, onPhoneChange, location, onLocationChange }) {
    return (
        <View style={styles.formSection}>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre Completo *</Text>
                <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={onFullNameChange}
                    placeholder="Ingresa tu nombre completo"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Teléfono</Text>
                <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={onPhoneChange}
                    placeholder="Ej: +54 11 1234-5678"
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Ubicación</Text>
                <TextInput
                    style={styles.input}
                    value={location}
                    onChangeText={onLocationChange}
                    placeholder="Ej: Buenos Aires, Argentina"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    formSection: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
    },
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
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1f2937',
    },
});