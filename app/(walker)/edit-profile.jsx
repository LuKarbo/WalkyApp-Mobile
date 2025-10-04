import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useToast } from '../../backend/Context/ToastContext';
import { useAuth } from '../../hooks/useAuth';

// Fotos predefinidas
const PRESET_PHOTOS = [
    'https://i.pravatar.cc/300?img=5',
    'https://i.pravatar.cc/300?img=6',
    'https://i.pravatar.cc/300?img=7',
    'https://i.pravatar.cc/300?img=8',
];

export default function EditProfileWalkerScreen() {
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

        // Aquí iría la llamada a la API
        // await UserAPI.updateUser(user.id, updatedData);

        showSuccess('Tus cambios han sido guardados correctamente');
        router.back();
    };

    return (
        <ScrollView style={styles.container}>
            
            <View style={styles.photoSection}>
                <TouchableOpacity onPress={() => setShowPhotoSelector(!showPhotoSelector)}>
                    <Image source={{ uri: selectedPhoto }} style={styles.profileImage} />
                    <View style={styles.editPhotoBadge}>
                        <Text style={styles.editPhotoIcon}>✏️</Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.photoLabel}>Toca para cambiar foto</Text>
            </View>

            {showPhotoSelector && (
                <View style={styles.photoSelector}>
                    <Text style={styles.sectionTitle}>Selecciona una foto</Text>
                    <View style={styles.photoGrid}>
                        {PRESET_PHOTOS.map((photo, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    setSelectedPhoto(photo);
                                    setShowPhotoSelector(false);
                                }}
                                style={[
                                    styles.photoOption,
                                    selectedPhoto === photo && styles.photoOptionSelected,
                                ]}
                            >
                                <Image source={{ uri: photo }} style={styles.photoOptionImage} />
                                {selectedPhoto === photo && (
                                    <View style={styles.selectedBadge}>
                                        <Text style={styles.selectedIcon}>✓</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            <View style={styles.formSection}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre Completo *</Text>
                    <TextInput
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Ingresa tu nombre completo"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        placeholder="Ej: +54 11 1234-5678"
                        keyboardType="phone-pad"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Ubicación</Text>
                    <TextInput
                        style={styles.input}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Ej: Buenos Aires, Argentina"
                    />
                </View>
            </View>

            <View style={styles.buttonSection}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Guardar Cambios</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    photoSection: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#ffffff',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#10b981',
    },
    editPhotoBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#10b981',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#ffffff',
    },
    editPhotoIcon: {
        fontSize: 16,
    },
    photoLabel: {
        marginTop: 12,
        fontSize: 14,
        color: '#6b7280',
    },
    photoSelector: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16,
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    photoOption: {
        position: 'relative',
    },
    photoOptionSelected: {
        opacity: 1,
    },
    photoOptionImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#e5e7eb',
    },
    selectedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#10b981',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    selectedIcon: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    formSection: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    buttonSection: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    saveButton: {
        backgroundColor: '#10b981',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});