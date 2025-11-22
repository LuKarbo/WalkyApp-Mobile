import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SaveButton({ onPress }) {
    return (
        <View style={styles.buttonSection}>
            <TouchableOpacity style={styles.saveButton} onPress={onPress}>
                <Text style={styles.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonSection: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    saveButton: {
        backgroundColor: '#10b981',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});