import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useToast } from '../../backend/Context/ToastContext';
import { UserController } from '../../backend/Controllers/UserController';
import PhotoSelector from '../../components/walker/editProfile/PhotoSelector';
import ProfileFormFields from '../../components/walker/editProfile/ProfileFormFields';
import ProfilePhotoSection from '../../components/walker/editProfile/ProfilePhotoSection';
import SaveButton from '../../components/walker/editProfile/SaveButton';
import { useAuth } from '../../hooks/useAuth';

const PRESET_PHOTOS = [
    'https://i.pravatar.cc/300?img=5',
    'https://i.pravatar.cc/300?img=6',
    'https://i.pravatar.cc/300?img=7',
    'https://i.pravatar.cc/300?img=8',
];

export default function EditProfileWalkerScreen() {
    const { user, updateUser } = useAuth(); // ⬅️ AGREGAR updateUser
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const [selectedPhoto, setSelectedPhoto] = useState(user?.profileImage || PRESET_PHOTOS[0]);
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [location, setLocation] = useState(user?.location || '');
    const [showPhotoSelector, setShowPhotoSelector] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => { 
        if (!fullName.trim()) {
            showError('El nombre es obligatorio');
            return;
        }

        if (!phone.trim()) {
            showError('El teléfono es obligatorio');
            return;
        }

        if (!location.trim()) {
            showError('Su ubicación es obligatoria');
            return;
        }

        try {
            setLoading(true);

            const updatedData = {
                name: fullName.trim(),
                profileImage: selectedPhoto,
                phone: phone.trim(),
                location: location.trim(),
            };

            const updatedUser = await UserController.mobileUpdateUser(user.id, updatedData);
            
            if (updateUser) {
                updateUser(updatedUser);
            }

            showSuccess('Tus cambios han sido guardados correctamente');
            router.push('/settings');
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            showError(error.message || 'Error al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPhoto = (photo) => {
        setSelectedPhoto(photo);
        setShowPhotoSelector(false);
    };

    return (
        <ScrollView style={styles.container}>
            <ProfilePhotoSection
                selectedPhoto={selectedPhoto}
                onPress={() => setShowPhotoSelector(!showPhotoSelector)}
            />

            <PhotoSelector
                photos={PRESET_PHOTOS}
                selectedPhoto={selectedPhoto}
                onSelectPhoto={handleSelectPhoto}
                visible={showPhotoSelector}
            />

            <ProfileFormFields
                fullName={fullName}
                onFullNameChange={setFullName}
                phone={phone}
                onPhoneChange={setPhone}
                location={location}
                onLocationChange={setLocation}
            />

            <SaveButton onPress={handleSave} loading={loading} /> {/* ⬅️ AGREGAR loading */}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
});