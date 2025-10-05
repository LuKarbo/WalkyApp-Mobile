import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useToast } from '../../backend/Context/ToastContext';
import PhotoSelector from '../../components/client/editProfile/PhotoSelector';
import ProfileFormFields from '../../components/client/editProfile/ProfileFormFields';
import ProfilePhotoSection from '../../components/client/editProfile/ProfilePhotoSection';
import SaveButton from '../../components/client/editProfile/SaveButton';
import { useAuth } from '../../hooks/useAuth';

const PRESET_PHOTOS = [
    'https://i.pravatar.cc/300?img=1',
    'https://i.pravatar.cc/300?img=2',
    'https://i.pravatar.cc/300?img=3',
    'https://i.pravatar.cc/300?img=4',
];

export default function EditProfileClientScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const [selectedPhoto, setSelectedPhoto] = useState(user?.profileImage || PRESET_PHOTOS[0]);
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [location, setLocation] = useState(user?.location || '');
    const [showPhotoSelector, setShowPhotoSelector] = useState(false);

    const handleSave = () => {
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

        const updatedData = {
            userId: user?.id,
            profileImage: selectedPhoto,
            fullName: fullName.trim(),
            phone: phone.trim(),
            location: location.trim(),
        };

        console.log('=== DATOS DE PERFIL ACTUALIZADOS ===');
        console.log('ID de usuario:', updatedData.userId);
        console.log('Foto de perfil:', updatedData.profileImage);
        console.log('Nombre completo:', updatedData.fullName);
        console.log('Teléfono:', updatedData.phone || '(sin cambios)');
        console.log('Ubicación:', updatedData.location || '(sin cambios)');
        console.log('====================================');

        showSuccess('Tus cambios han sido guardados correctamente');
        router.back();
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

            <SaveButton onPress={handleSave} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
});