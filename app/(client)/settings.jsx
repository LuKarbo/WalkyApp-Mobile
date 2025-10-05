import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { useToast } from '../../backend/Context/ToastContext';
import ActionsSection from '../../components/client/settings/ActionsSection';
import Footer from '../../components/client/settings/Footer';
import InfoSection from '../../components/client/settings/InfoSection';
import ProfileHeader from '../../components/client/settings/ProfileHeader';
import { useAuth } from '../../hooks/useAuth';

export default function ClientSettingsScreen() {
    const { user, logout } = useAuth();
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
            <ProfileHeader
                user={user}
                getRoleBadgeColor={getRoleBadgeColor}
                getRoleLabel={getRoleLabel}
            />

            <InfoSection user={user} />

            <ActionsSection
                onEditProfile={() => router.push('/edit-profile')}
                onAddPet={() => Alert.alert('Próximamente', 'Agregar mascota en desarrollo')}
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