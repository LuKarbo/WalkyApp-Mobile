import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ActionsSection({ onEditProfile, onLogout }) {
    const router = useRouter();

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

            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/(pet)/')}
            >
                <Text style={styles.actionIcon}>🐕</Text>
                <Text style={styles.actionText}>Mis Mascotas</Text>
                <Text style={styles.actionArrow}>›</Text>
            </TouchableOpacity>

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