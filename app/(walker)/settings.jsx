import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { useToast } from '../../backend/Context/ToastContext';
import { UserController } from '../../backend/Controllers/UserController';
import ActionsSection from '../../components/walker/settings/ActionsSection';
import Footer from '../../components/walker/settings/Footer';
import InfoSection from '../../components/walker/settings/InfoSection';
import ProfileHeader from '../../components/walker/settings/ProfileHeader';
import { useAuth } from '../../hooks/useAuth';

export default function WalkerSettingsScreen() {
    const { user, logout, updateUser } = useAuth();
    const [gpsEnabled, setGpsEnabled] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);
    const router = useRouter();
    const { showSuccess, showError } = useToast();
    
    useFocusEffect(
        useCallback(() => {
            const loadUserData = async () => {
                try {
                    const userData = await UserController.fetchUserById(user.id);
                    setCurrentUser(userData);
                    updateUser(userData);
                } catch (error) {
                    console.error('Error cargando datos del usuario:', error);
                }
            };

            loadUserData();
        }, [user?.id])
    );
    
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

    const handleGpsToggle = (value) => {
        setGpsEnabled(value);
        if(value){
            showSuccess('GPS Activado');
        }
        else{
            showError('GPS Desactivado');
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