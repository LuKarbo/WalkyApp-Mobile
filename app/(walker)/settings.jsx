import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useToast } from '../../backend/Context/ToastContext';
import { useAuth } from '../../hooks/useAuth';

export default function WalkerSettingsScreen() {
    const { user, logout } = useAuth();
    const [gpsEnabled, setGpsEnabled] = useState(false);
    const router = useRouter();
    const { showSuccess, showError } = useToast();
    
    const handleLogout = () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro que deseas cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Cerrar Sesión',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    },
                },
            ]
        );
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return '#ef4444';
            case 'walker':
                return '#10b981';
            case 'client':
                return '#6366f1';
            default:
                return '#6b7280';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin':
                return 'Administrador';
            case 'walker':
                return 'Paseador';
            case 'client':
                return 'Cliente';
            default:
                return 'Usuario';
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                {user?.profileImage ? (
                    <Image
                        source={{ uri: user.profileImage }}
                        style={styles.profileImage}
                    />
                ) : (
                    <View style={styles.profilePlaceholder}>
                        <Text style={styles.profileInitial}>
                            {user?.fullName?.[0]?.toUpperCase() || 'U'}
                        </Text>
                    </View>
                )}
                
                <Text style={styles.name}>{user?.fullName || 'Usuario'}</Text>
                
                <View
                    style={[
                        styles.roleBadge,
                        { backgroundColor: getRoleBadgeColor(user?.role) },
                    ]}
                >
                    <Text style={styles.roleBadgeText}>
                        {getRoleLabel(user?.role)}
                    </Text>
                </View>
            </View>

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

            <View style={styles.actionsSection}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => {
                        router.push('/edit-profile');
                    }}
                >
                    <Text style={styles.actionIcon}>✏️</Text>
                    <Text style={styles.actionText}>Editar Perfil</Text>
                    <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>

                <View style={styles.actionButton}>
                    <Text style={styles.actionIcon}>📍</Text>
                    <View style={styles.actionTextContainer}>
                        <Text style={styles.actionText}>Activar Rastro GPS</Text>
                        <Text style={styles.actionDescription}>
                            Permite a los clientes ver tu ubicación
                        </Text>
                    </View>
                    <Switch
                        value={gpsEnabled}
                        onValueChange={(value) => {
                            setGpsEnabled(value);
                            if(value){
                                showSuccess('GPS Activado');
                            }
                            else{
                                showError('GPS Desactivado');
                            }
                        }}
                        trackColor={{ false: '#d1d5db', true: '#10b981' }}
                        thumbColor="#ffffff"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.actionButton, styles.logoutButton]}
                    onPress={handleLogout}
                >
                    <Text style={styles.actionIcon}>🚪</Text>
                    <Text style={[styles.actionText, styles.logoutText]}>
                        Cerrar Sesión
                    </Text>
                    <Text style={styles.actionArrow}>›</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>WalkyAPP v1.0.0</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#10b981',
    },
    profilePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileInitial: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    roleBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    roleBadgeText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
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
    footer: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    footerText: {
        color: '#9ca3af',
        fontSize: 12,
    },
});