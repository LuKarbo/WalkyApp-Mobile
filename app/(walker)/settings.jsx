import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Linking, Platform, ScrollView, StyleSheet } from 'react-native';
import { useToast } from '../../backend/Context/ToastContext';
import { SettingController } from '../../backend/Controllers/SettingController';
import { UserController } from '../../backend/Controllers/UserController';
import { GPSService } from '../../backend/System/GPSService';
import LogoutModal from '../../components/common/LogoutModal';
import PermissionModal from '../../components/common/PermissionModal';
import ActionsSection from '../../components/walker/settings/ActionsSection';
import Footer from '../../components/walker/settings/Footer';
import InfoSection from '../../components/walker/settings/InfoSection';
import ProfileHeader from '../../components/walker/settings/ProfileHeader';
import { useAuth } from '../../hooks/useAuth';

export default function WalkerSettingsScreen() {
    const { user, logout, updateUser } = useAuth();
    const [gpsEnabled, setGpsEnabled] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);
    const [walkerSettings, setWalkerSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [foregroundSubscription, setForegroundSubscription] = useState(null);
    
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [showPermissionModal, setShowPermissionModal] = useState(false);
    const [permissionModalConfig, setPermissionModalConfig] = useState({});
    
    const router = useRouter();
    const { showSuccess, showError, showWarning } = useToast();
    
    useFocusEffect(
        useCallback(() => {
            const loadUserData = async () => {
                try {
                    const userData = await UserController.fetchUserById(user.id);
                    setCurrentUser(userData);
                    updateUser(userData);
                    
                    if (userData.role === 'walker') {
                        await loadWalkerSettings();
                    }
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            };

            loadUserData();
        }, [user?.id])
    );

    const loadWalkerSettings = async () => {
        try {
            const settings = await SettingController.fetchWalkerSettings(user.id);
            setWalkerSettings(settings);
            setGpsEnabled(settings.gpsTrackingEnabled);
            
            const permissions = await GPSService.checkLocationPermissions();
            if (settings.gpsTrackingEnabled && permissions.foreground) {
                if (permissions.background) {
                    const isTracking = await GPSService.isTrackingActive();
                    if (!isTracking) {
                        await GPSService.startBackgroundTracking(settings.gpsTrackingInterval);
                    }
                }
            }
        } catch (error) {
            console.error('Error loading walker settings:', error);
        }
    };

    useEffect(() => {
        const requestPermissions = async () => {
            try {
                await GPSService.requestLocationPermissions();
            } catch (error) {
                console.error('Error requesting permissions:', error);
            }
        };

        if (user?.role === 'walker') {
            requestPermissions();
        }
    }, [user?.role]);

    const openSettings = async () => {
        try {
            if (Platform.OS === 'ios') {
                await Linking.openURL('app-settings:');
            } else {
                await Linking.openSettings();
            }
        } catch (error) {
            console.error('Error opening settings:', error);
            showError('No se pudo abrir la configuración del dispositivo');
        }
    };
    
    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = async () => {
        try {
            setIsLoggingOut(true);
            
            if (gpsEnabled) {
                await GPSService.stopBackgroundTracking();
                if (foregroundSubscription) {
                    GPSService.stopForegroundTracking(foregroundSubscription);
                    setForegroundSubscription(null);
                }
            }
            
            await logout();
            setShowLogoutModal(false);
        } catch (error) {
            console.error('Error logging out:', error);
            showError('Error al cerrar sesión');
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleGpsToggle = async (value) => {
        if (isLoading) return;

        setIsLoading(true);
        
        try {
            const permissions = await GPSService.checkLocationPermissions();
            
            if (value && !permissions.foreground) {
                setIsLoading(false);
                
                setPermissionModalConfig({
                    title: 'Permisos Requeridos',
                    message: 'La aplicación necesita acceso a tu ubicación para activar el GPS. Por favor, ve a Configuración y permite el acceso a la ubicación.',
                    icon: 'map-pin',
                    iconColor: '#f59e0b',
                    buttons: [
                        {
                            text: 'Cancelar',
                            style: 'cancel',
                            onPress: () => setShowPermissionModal(false)
                        },
                        {
                            text: 'Ir a Configuración',
                            style: 'primary',
                            onPress: () => {
                                setShowPermissionModal(false);
                                openSettings();
                            }
                        }
                    ]
                });
                setShowPermissionModal(true);
                return;
            }

            if (value && permissions.foreground) {
                if (!permissions.background) {
                    setIsLoading(false);
                    
                    setPermissionModalConfig({
                        title: 'Rastreo Limitado',
                        message: 'Solo tienes permisos de ubicación "Mientras uso la app". El GPS funcionará pero se detendrá cuando cierres la aplicación.\n\n¿Deseas continuar o configurar permisos "Siempre"?',
                        icon: 'alert-triangle',
                        iconColor: '#f59e0b',
                        buttons: [
                            {
                                text: 'Cancelar',
                                style: 'cancel',
                                onPress: () => setShowPermissionModal(false)
                            },
                            {
                                text: 'Continuar así',
                                style: 'primary',
                                onPress: async () => {
                                    setShowPermissionModal(false);
                                    setIsLoading(true);
                                    await activateGPS(value, false);
                                }
                            },
                            {
                                text: 'Configurar "Siempre"',
                                style: 'primary',
                                onPress: () => {
                                    setShowPermissionModal(false);
                                    openSettings();
                                }
                            }
                        ]
                    });
                    setShowPermissionModal(true);
                    return;
                }
                
                await activateGPS(value, permissions.background);
            } else if (!value) {
                await activateGPS(value, permissions.background);
            }
        } catch (error) {
            console.error('Error toggling GPS:', error);
            showError('Error al cambiar estado del GPS');
            setIsLoading(false);
        }
    };

    const activateGPS = async (value, hasBackgroundPermission) => {
        try {
            const updatedSettings = await SettingController.updateGpsSettings(user.id, {
                gpsTrackingEnabled: value,
                gpsTrackingInterval: walkerSettings?.gpsTrackingInterval || 300 
            });

            setWalkerSettings(updatedSettings);
            setGpsEnabled(value);

            if (value) {
                if (hasBackgroundPermission) {
                    await GPSService.startBackgroundTracking(300);
                    showSuccess('GPS Activado en segundo plano (cada 5 min)');
                } else {
                    const subscription = await GPSService.startForegroundTracking(
                        180,
                        (location) => {
                            console.log('Location updated:', location);
                        }
                    );
                    setForegroundSubscription(subscription);
                    showWarning('GPS Activado en primer plano (cada 3 min)');
                }
                
                try {
                    const location = await GPSService.getCurrentLocation();
                    console.log('Current location:', location);
                } catch (error) {
                    console.error('Error getting location:', error);
                }
            } else {
                await GPSService.stopBackgroundTracking();
                if (foregroundSubscription) {
                    GPSService.stopForegroundTracking(foregroundSubscription);
                    setForegroundSubscription(null);
                }
                showError('GPS Desactivado');
            }
        } catch (error) {
            console.error('Error activating GPS:', error);
            showError(error.message || 'Error al actualizar GPS');
        } finally {
            setIsLoading(false);
        }
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
        <>
            <ScrollView style={styles.container}>
                <ProfileHeader
                    user={currentUser}
                    getRoleBadgeColor={getRoleBadgeColor}
                    getRoleLabel={getRoleLabel}
                />

                <InfoSection user={currentUser} />

                <ActionsSection
                    onEditProfile={() => router.push('/edit-profile')}
                    gpsEnabled={gpsEnabled}
                    onGpsToggle={handleGpsToggle}
                    onLogout={handleLogout}
                    isLoadingGps={isLoading}
                />

                <Footer />
            </ScrollView>

            <LogoutModal
                visible={showLogoutModal}
                onClose={handleCancelLogout}
                onConfirm={handleConfirmLogout}
                isLoading={isLoggingOut}
            />

            <PermissionModal
                visible={showPermissionModal}
                onClose={() => setShowPermissionModal(false)}
                {...permissionModalConfig}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
});