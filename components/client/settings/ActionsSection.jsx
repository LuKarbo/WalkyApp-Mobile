import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ActionsSection({ onEditProfile, onAddPet, onLogout }) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Opciones Disponibles</Text>

            <TouchableOpacity style={styles.actionItem} onPress={onEditProfile}>
                <View style={styles.actionLeft}>
                    <Ionicons name="person-outline" size={24} color="#6366f1" />
                    <Text style={styles.actionText}>Editar Perfil</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem} onPress={onAddPet}>
                <View style={styles.actionLeft}>
                    <Ionicons name="paw-outline" size={24} color="#10b981" />
                    <Text style={styles.actionText}>Mis Mascotas</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionItem, styles.logoutItem]} onPress={onLogout}>
                <View style={styles.actionLeft}>
                    <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                    <Text style={[styles.actionText, styles.logoutText]}>Cerrar Sesión</Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#9ca3af" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginTop: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    actionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#374151',
    },
    logoutItem: {
        borderBottomWidth: 0,
        marginTop: 8,
    },
    logoutText: {
        color: '#ef4444',
    },
});