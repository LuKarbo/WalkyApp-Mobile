import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useToast } from '../../backend/Context/ToastContext';
import { PetsController } from '../../backend/Controllers/PetsController';
import { useAuth } from '../../hooks/useAuth';

const petImageOptions = [
    "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=300&fit=crop&crop=face"
];

export default function AddPetScreen() {
    const [formData, setFormData] = useState({
        name: '',
        image: petImageOptions[0],
        weight: '',
        age: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageSelect = (imageUrl) => {
        setFormData(prev => ({
            ...prev,
            image: imageUrl
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            showError('El nombre es obligatorio');
            return false;
        }

        if (formData.weight && (isNaN(formData.weight) || parseFloat(formData.weight) <= 0)) {
            showError('El peso debe ser un número válido mayor a 0');
            return false;
        }

        if (formData.age && (isNaN(formData.age) || parseInt(formData.age) <= 0)) {
            showError('La edad debe ser un número válido mayor a 0');
            return false;
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const petData = {
                ...formData,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                age: formData.age ? parseInt(formData.age) : null
            };

            await PetsController.createPet(user.id, petData);
            router.back();
            showSuccess('Mascota agregada correctamente');
        } catch (error) {
            console.error('Error al agregar mascota:', error);
            router.back();
            showError(`Error al agregar la mascota: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Agregar Nueva Mascota</Text>

                <View style={styles.section}>
                    <Text style={styles.label}>📷 Foto de la Mascota</Text>
                    <View style={styles.selectedImageContainer}>
                        <Image
                            source={{ uri: formData.image }}
                            style={styles.selectedImage}
                        />
                    </View>
                    <View style={styles.imageGrid}>
                        {petImageOptions.map((image, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => handleImageSelect(image)}
                                style={[
                                    styles.imageOption,
                                    formData.image === image && styles.imageOptionSelected
                                ]}
                            >
                                <Image
                                    source={{ uri: image }}
                                    style={styles.imageOptionImage}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>👤 Nombre *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.name}
                        onChangeText={(value) => handleInputChange('name', value)}
                        placeholder="Nombre de tu mascota"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>📦 Peso (kg)</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.weight}
                        onChangeText={(value) => handleInputChange('weight', value)}
                        placeholder="Peso de tu mascota"
                        keyboardType="decimal-pad"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>📅 Edad (años)</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.age}
                        onChangeText={(value) => handleInputChange('age', value)}
                        placeholder="Edad de tu mascota"
                        keyboardType="number-pad"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>📝 Descripción</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.description}
                        onChangeText={(value) => handleInputChange('description', value)}
                        placeholder="Cuéntanos sobre tu mascota..."
                        multiline
                        numberOfLines={4}
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => router.back()}
                        disabled={loading}
                    >
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.submitButtonText}>
                            {loading ? 'Guardando...' : 'Agregar Mascota'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 24,
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1f2937',
        marginBottom: 8,
    },
    selectedImageContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    selectedImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,
        borderColor: '#6366f1',
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    imageOption: {
        width: '22%',
        aspectRatio: 1,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#e5e7eb',
    },
    imageOptionSelected: {
        borderColor: '#6366f1',
        borderWidth: 3,
    },
    imageOptionImage: {
        width: '100%',
        height: '100%',
    },
    input: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        color: '#1f2937',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    submitButton: {
        flex: 1,
        backgroundColor: '#6366f1',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});