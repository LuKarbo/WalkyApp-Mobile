import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet } from 'react-native';
import { useToast } from '../../backend/Context/ToastContext';
import { SettingController } from '../../backend/Controllers/SettingController';
import { UserController } from '../../backend/Controllers/UserController';
import { GPSService } from '../../backend/System/GPSService';
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
    const router = useRouter();
    const { showSuccess, showError, showWarning } = useToast();
    
    useFocusEffect(
        useCallback(() => {
            const loadUserData = async () => {
                try {
                    const userData = await UserController.fetchUserById(user.id);
                    setCurrentUser(userData);
                    updateUser(userData);
                    
                    // Cargar configuraciones de paseador si el rol es walker
                    if (userData.role === 'walker') {
                        await loadWalkerSettings();
                    }
                } catch (error) {
                    console.error('Error cargando datos del usuario:', error);
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
            
            // Sincronizar estado del GPS con el servicio
            const permissions = await GPSService.checkLocationPermissions();
            if (settings.gpsTrackingEnabled && permissions.foreground) {
                // Si tiene permisos de segundo plano, usar ese modo
                if (permissions.background) {
                    const isTracking = await GPSService.isTrackingActive();
                    if (!isTracking) {
                        await GPSService.startBackgroundTracking(settings.gpsTrackingInterval);
                    }
                } else {
                    // Si solo tiene permisos en primer plano, usar ese modo
                    console.log('⚠️ Solo permisos de primer plano, usando modo foreground');
                }
            }
        } catch (error) {
            console.error('Error cargando configuraciones del paseador:', error);
        }
    };

    useEffect(() => {
        // Solicitar permisos al montar el componente
        const requestPermissions = async () => {
            try {
                await GPSService.requestLocationPermissions();
            } catch (error) {
                console.error('Error solicitando permisos:', error);
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
            console.error('Error abriendo configuración:', error);
            showError('No se pudo abrir la configuración del dispositivo');
        }
    };
    
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
                        // Detener GPS antes de cerrar sesión
                        if (gpsEnabled) {
                            await GPSService.stopBackgroundTracking();
                            if (foregroundSubscription) {
                                GPSService.stopForegroundTracking(foregroundSubscription);
                                setForegroundSubscription(null);
                            }
                        }
                        await logout();
                    },
                },
            ]
        );
    };

    const handleGpsToggle = async (value) => {
        if (isLoading) return;

        setIsLoading(true);
        
        try {
            // Verificar permisos
            const permissions = await GPSService.checkLocationPermissions();
            
            if (value && !permissions.foreground) {
                setIsLoading(false);
                Alert.alert(
                    'Permisos Requeridos',
                    'La aplicación necesita acceso a tu ubicación para activar el GPS. Por favor, ve a Configuración y permite el acceso a la ubicación.',
                    [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                            text: 'Ir a Configuración',
                            onPress: openSettings
                        }
                    ]
                );
                return;
            }

            // Si tiene permisos de primer plano, activar GPS
            if (value && permissions.foreground) {
                if (!permissions.background) {
                    Alert.alert(
                        'Rastreo Limitado',
                        'Solo tienes permisos de ubicación "Mientras uso la app". El GPS funcionará pero se detendrá cuando cierres la aplicación.\n\n¿Deseas continuar o configurar permisos "Siempre"?',
                        [
                            { 
                                text: 'Continuar así', 
                                onPress: async () => {
                                    await activateGPS(value, false);
                                }
                            },
                            {
                                text: 'Configurar "Siempre"',
                                onPress: () => {
                                    setIsLoading(false);
                                    openSettings();
                                }
                            },
                            {
                                text: 'Cancelar',
                                style: 'cancel',
                                onPress: () => setIsLoading(false)
                            }
                        ]
                    );
                    return;
                }
                
                await activateGPS(value, permissions.background);
            } else if (!value) {
                await activateGPS(value, permissions.background);
            }
        } catch (error) {
            console.error('Error en handleGpsToggle:', error);
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
                            console.log('📍 Ubicación capturada (primer plano):', location);
                        }
                    );
                    setForegroundSubscription(subscription);
                    showWarning('GPS Activado en primer plano (cada 3 min)');
                }
                
                try {
                    const location = await GPSService.getCurrentLocation();
                    console.log('📍 Ubicación inicial:', location);
                } catch (error) {
                    console.error('Error obteniendo ubicación inicial:', error);
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
            console.error('Error activando/desactivando GPS:', error);
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
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
});