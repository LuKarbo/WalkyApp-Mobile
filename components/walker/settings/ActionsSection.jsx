import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function ActionsSection({ onEditProfile, gpsEnabled, onGpsToggle, onLogout, isLoadingGps = false }) {
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

            <View style={styles.actionItem}>
                <View style={styles.actionLeft}>
                    <Ionicons name="location-outline" size={24} color="#10b981" />
                    <Text style={styles.actionText}>Rastreo GPS</Text>
                </View>
                {isLoadingGps ? (
                    <ActivityIndicator size="small" color="#10b981" />
                ) : (
                    <Switch
                        value={gpsEnabled}
                        onValueChange={onGpsToggle}
                        trackColor={{ false: '#d1d5db', true: '#86efac' }}
                        thumbColor={gpsEnabled ? '#10b981' : '#f3f4f6'}
                        disabled={isLoadingGps}
                    />
                )}
            </View>

            {gpsEnabled && (
                <View style={styles.gpsInfo}>
                    <Ionicons name="information-circle-outline" size={16} color="#6366f1" />
                    <Text style={styles.gpsInfoText}>
                        El GPS está activo y rastreando tu ubicación en segundo plano
                    </Text>
                </View>
            )}

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
    gpsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#eff6ff',
        padding: 12,
        borderRadius: 8,
        marginTop: 8,
    },
    gpsInfoText: {
        flex: 1,
        fontSize: 13,
        color: '#4f46e5',
        lineHeight: 18,
    },
    logoutItem: {
        borderBottomWidth: 0,
        marginTop: 8,
    },
    logoutText: {
        color: '#ef4444',
    },
});