import { StyleSheet, Text, View } from 'react-native';

export default function LogoHeader() {
    return (
        <View style={styles.logoContainer}>
            <Text style={styles.logo}>🐕</Text>
            <Text style={styles.title}>WalkyAPP</Text>
            <Text style={styles.subtitle}>Bienvenido de nuevo</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logo: {
        fontSize: 64,
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
    },
});