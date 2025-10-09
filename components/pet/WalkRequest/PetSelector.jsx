import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../../../backend/Context/UserContext';
import { PetsController } from '../../../backend/Controllers/PetsController';

export default function PetSelector({ selectedPets, onPetsChange, onContinue }) {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useUser();

    useEffect(() => {
        loadPets();
    }, []);

    const loadPets = async () => {
        try {
            setLoading(true);
            setError(null);
            const petsData = await PetsController.fetchPetsByOwner(user?.id);
            setPets(petsData || []);
        } catch (err) {
            setError('Error al cargar mascotas');
            console.error('Error loading pets:', err);
        } finally {
            setLoading(false);
        }
    };

    const togglePet = (pet) => {
        const isSelected = selectedPets.some(p => p.id === pet.id);
        if (isSelected) {
            onPetsChange(selectedPets.filter(p => p.id !== pet.id));
        } else {
            onPetsChange([...selectedPets, pet]);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>Cargando mascotas...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="alert-circle" size={48} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadPets}>
                    <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (pets.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="paw" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>No tienes mascotas registradas</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Ionicons name="paw" size={24} color="#6366f1" />
                    <Text style={styles.title}>Selecciona tus mascotas</Text>
                </View>

                <Text style={styles.subtitle}>
                    Puedes seleccionar una o más mascotas para el paseo
                </Text>

                <View style={styles.petsContainer}>
                    {pets.map(pet => {
                        const isSelected = selectedPets.some(p => p.id === pet.id);
                        return (
                            <TouchableOpacity
                                key={pet.id}
                                style={[styles.petCard, isSelected && styles.petCardSelected]}
                                onPress={() => togglePet(pet)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.petContent}>
                                    <Image
                                        source={{ uri: pet.image }}
                                        style={styles.petImage}
                                    />
                                    <View style={styles.petInfo}>
                                        <Text style={styles.petName}>{pet.name}</Text>
                                        <View style={styles.petDetails}>
                                            {pet.weight && (
                                                <Text style={styles.petDetail}>{pet.weight} kg</Text>
                                            )}
                                            {pet.age && (
                                                <Text style={styles.petDetail}>• {pet.age} años</Text>
                                            )}
                                        </View>
                                        {pet.description && (
                                            <Text style={styles.petDescription} numberOfLines={2}>
                                                {pet.description}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={styles.checkContainer}>
                                        {isSelected ? (
                                            <Ionicons name="checkmark-circle" size={28} color="#6366f1" />
                                        ) : (
                                            <Ionicons name="ellipse-outline" size={28} color="#d1d5db" />
                                        )}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.selectedInfo}>
                    <Text style={styles.selectedCount}>
                        {selectedPets.length} {selectedPets.length === 1 ? 'mascota seleccionada' : 'mascotas seleccionadas'}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.continueButton, selectedPets.length === 0 && styles.continueButtonDisabled]}
                    onPress={onContinue}
                    disabled={selectedPets.length === 0}
                >
                    <Text style={styles.continueText}>Continuar</Text>
                    <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
        marginLeft: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 20,
    },
    petsContainer: {
        marginBottom: 100,
    },
    petCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#e5e7eb',
    },
    petCardSelected: {
        borderColor: '#6366f1',
        backgroundColor: '#eef2ff',
    },
    petContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    petImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    petInfo: {
        flex: 1,
    },
    petName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
    },
    petDetails: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    petDetail: {
        fontSize: 13,
        color: '#6b7280',
        marginRight: 8,
    },
    petDescription: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 4,
    },
    checkContainer: {
        marginLeft: 8,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    selectedInfo: {
        marginBottom: 12,
    },
    selectedCount: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        fontWeight: '600',
    },
    continueButton: {
        backgroundColor: '#6366f1',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    continueButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    continueText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    loadingText: {
        marginTop: 12,
        color: '#6b7280',
        fontSize: 16,
    },
    errorText: {
        marginTop: 12,
        color: '#ef4444',
        fontSize: 16,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#6366f1',
        borderRadius: 8,
    },
    retryText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    emptyText: {
        marginTop: 12,
        color: '#9ca3af',
        fontSize: 16,
    },
});