import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function LoginButton({ onPress, isLoading = false }) {
    return (
        <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={onPress}
            disabled={isLoading}
        >
            {isLoading ? (
                <ActivityIndicator color="#ffffff" />
            ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    loginButton: {
        backgroundColor: '#6366f1',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    loginButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    loginButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});