import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ActionsSection({ onEditProfile, gpsEnabled, onGpsToggle, onLogout }) {
    return (
        <View style={styles.actionsSection}>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={onEditProfile}
            >
                <Text style={styles.actionIcon}>✏️</Text>
                <Text style={styles.actionText}>Editar Perfil</Text>
                <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.actionButton}>
                <Text style={styles.actionIcon}>📍</Text>
                <View style={styles.actionTextContainer}>
                    <Text style={styles.actionText}>Activar Seguimiento GPS</Text>
                    <Text style={styles.actionDescription}>
                        Permite a los clientes ver tu ubicación solo en los paseos activos
                    </Text>
                </View>
                <Switch
                    value={gpsEnabled}
                    onValueChange={onGpsToggle}
                    trackColor={{ false: '#d1d5db', true: '#10b981' }}
                    thumbColor="#ffffff"
                />
            </View>

            <TouchableOpacity
                style={[styles.actionButton, styles.logoutButton]}
                onPress={onLogout}
            >
                <Text style={styles.actionIcon}>🚪</Text>
                <Text style={[styles.actionText, styles.logoutText]}>
                    Cerrar Sesión
                </Text>
                <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    actionsSection: {
        backgroundColor: '#ffffff',
        marginTop: 16,
        marginHorizontal: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    actionIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    actionText: {
        flex: 1,
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '500',
    },
    actionTextContainer: {
        flex: 1,
    },
    actionDescription: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    actionArrow: {
        fontSize: 24,
        color: '#9ca3af',
    },
    logoutButton: {
        borderBottomWidth: 0,
    },
    logoutText: {
        color: '#ef4444',
    },
});