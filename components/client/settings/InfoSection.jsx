import { StyleSheet, Text, View } from 'react-native';

export default function InfoSection({ user }) {
    return (
        <View style={styles.infoSection}>
            <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || 'No disponible'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Suscripción</Text>
                <Text style={styles.infoValue}>{user?.suscription || 'Basic'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Teléfono</Text>
                <Text style={styles.infoValue}>{user?.phone || 'No disponible'}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Ubicación</Text>
                <Text style={styles.infoValue}>{user?.location || 'No disponible'}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    infoSection: {
        backgroundColor: '#ffffff',
        marginTop: 16,
        marginHorizontal: 16,
        borderRadius: 12,
        padding: 16,
    },
    infoItem: {
        paddingVertical: 12,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
    },
});