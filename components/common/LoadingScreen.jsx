import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen({ message = 'Cargando...' }) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.text}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    text: {
        marginTop: 16,
        fontSize: 16,
        color: '#6b7280',
        fontWeight: '500',
    },
});