import { StyleSheet, Text, View } from 'react-native';

export default function Footer() {
    return (
        <View style={styles.footer}>
            <Text style={styles.footerText}>WalkyAPP v1.0.0</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    footer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    footerText: {
        color: '#9ca3af',
        fontSize: 12,
    },
});