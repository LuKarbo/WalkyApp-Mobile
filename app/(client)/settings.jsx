import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { UserController } from '../../backend/Controllers/UserController';
import ActionsSection from '../../components/client/settings/ActionsSection';
import Footer from '../../components/client/settings/Footer';
import InfoSection from '../../components/client/settings/InfoSection';
import ProfileHeader from '../../components/client/settings/ProfileHeader';
import LogoutModal from '../../components/common/LogoutModal';
import { useAuth } from '../../hooks/useAuth';

export default function ClientSettingsScreen() {
    const { user, logout, updateUser } = useAuth();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState(user);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const loadUserData = async () => {
                try {
                    const userData = await UserController.fetchUserById(user.id);
                    setCurrentUser(userData);
                    updateUser(userData);
                } catch (error) {
                    
                }
            };

            loadUserData();
        }, [user?.id])
    );

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = async () => {
        try {
            setIsLoggingOut(true);
            await logout();
            setShowLogoutModal(false);
        } catch (error) {
            
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
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
                    onAddPet={() => router.push('/(pet)')}
                    onLogout={handleLogout}
                />

                <Footer />
            </ScrollView>

            <LogoutModal
                visible={showLogoutModal}
                onClose={handleCancelLogout}
                onConfirm={handleConfirmLogout}
                isLoading={isLoggingOut}
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