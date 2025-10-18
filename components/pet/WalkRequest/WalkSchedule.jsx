import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useToast } from '../../../backend/Context/ToastContext';
import { WalksController } from '../../../backend/Controllers/WalksController';
import { useAuth } from '../../../hooks/useAuth';
import PriceSummary from './PriceSummary';

export default function WalkSchedule({ 
    selectedWalker, 
    walkerSettings, 
    selectedPets, 
    onBack, 
    onSuccess 
}) {
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [description, setDescription] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { user } = useAuth();
    const userId = user?.id;
    const { showSuccess, showError, showWarning } = useToast();
    
    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            setTime(selectedTime);
        }
    };

    const calculateFinalPrice = () => {
        const basePrice = walkerSettings?.pricePerPet || 15000;
        const petCount = selectedPets.length;
        const subtotal = basePrice * petCount;
        
        if (walkerSettings?.hasDiscount && walkerSettings?.discountPercentage > 0) {
            const discountAmount = subtotal * (walkerSettings.discountPercentage / 100);
            return subtotal - discountAmount;
        }
        return subtotal;
    };

    const handleSubmit = async () => {
        
        if (!date) {
            showWarning('Debe seleccionar una fecha');
            return;
        }

        if (!time) {
            showWarning('Debe seleccionar una hora para el paseo');
            return;
        }

        try {
            setSubmitting(true);

            const dateStr = date.toISOString().split('T')[0];
            const timeStr = time.toTimeString().split(' ')[0].substring(0, 5);
            const scheduledDateTime = `${dateStr}T${timeStr}`;

            const finalPrice = calculateFinalPrice();
            const walkRequest = {
                walkerId: selectedWalker.id,
                ownerId: userId,
                petIds: selectedPets.map(pet => pet.id),
                scheduledDateTime: scheduledDateTime,
                description: description,
                totalPrice: finalPrice,
                status: 'Pending'
            };

            await WalksController.createWalkRequest(walkRequest);
            
            showSuccess('Tu solicitud de paseo ha sido registrada correctamente');
            
            onSuccess();

        } catch (error) {

            let errorMessage = 'No se pudo enviar la solicitud';
            
            if (error.message) {
                const match = error.message.match(/Error en base de datos: (.+)/);
                if (match && match[1]) {
                    errorMessage = match[1];
                } else {
                    errorMessage = error.message;
                }
            }
            
            showError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#6366f1" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Ionicons name="calendar" size={24} color="#6366f1" />
                    <Text style={styles.title}>Programar Paseo</Text>
                </View>
            </View>

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Paseador Seleccionado</Text>
                    <View style={styles.walkerCard}>
                        <Image
                            source={{ uri: selectedWalker.image }}
                            style={styles.walkerImage}
                        />
                        <View style={styles.walkerInfo}>
                            <View style={styles.walkerHeader}>
                                <Text style={styles.walkerName}>{selectedWalker.name}</Text>
                                <View style={styles.badges}>
                                    {selectedWalker.verified && (
                                        <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                                    )}
                                    {walkerSettings?.hasGPSTracker ? (
                                        <Ionicons name="navigate" size={20} color="#10b981" />
                                    ) : (
                                        <Ionicons name="navigate-outline" size={20} color="#9ca3af" />
                                    )}
                                </View>
                            </View>
                            <View style={styles.walkerLocation}>
                                <Ionicons name="location" size={14} color="#6b7280" />
                                <Text style={styles.walkerLocationText}>
                                    {selectedWalker.location || 'Ubicación no disponible'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.detailsRow}>
                        <View style={styles.detailBox}>
                            <Text style={styles.detailLabel}>Precio por mascota</Text>
                            <Text style={styles.detailValue}>
                                ${(walkerSettings?.pricePerPet || 15000).toLocaleString()}
                            </Text>
                        </View>
                        <View style={styles.detailBox}>
                            <Text style={styles.detailLabel}>Rastreo GPS</Text>
                            <Text style={[styles.detailValue, walkerSettings?.hasGPSTracker ? styles.gpsActive : styles.gpsInactive]}>
                                {walkerSettings?.hasGPSTracker ? '✓ Activo' : '✗ No disponible'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mascotas Seleccionadas</Text>
                    {selectedPets.map(pet => (
                        <View key={pet.id} style={styles.petItem}>
                            <Image source={{ uri: pet.image }} style={styles.petImage} />
                            <View style={styles.petInfo}>
                                <Text style={styles.petName}>{pet.name}</Text>
                                {(pet.weight || pet.age) && (
                                    <View style={styles.petDetails}>
                                        {pet.weight && <Text style={styles.petDetail}>{pet.weight} kg</Text>}
                                        {pet.age && <Text style={styles.petDetail}>• {pet.age} años</Text>}
                                    </View>
                                )}
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fecha y Hora</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Fecha <Text style={styles.required}>*</Text>
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.dateButton,
                                !date && styles.dateButtonEmpty
                            ]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={[
                                styles.dateButtonText,
                                !date && { color: '#ef4444', fontStyle: 'italic' }
                            ]}>
                                {date 
                                    ? `📅 ${date?.toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}`
                                    : '📅 Seleccionar Fecha del paseo'
                                }
                            </Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={date || new Date()}
                                mode="date"
                                display="default"
                                onChange={onDateChange}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Hora <Text style={styles.required}>*</Text>
                        </Text>
                        <TouchableOpacity
                            style={[
                                styles.dateButton,
                                !time && styles.dateButtonEmpty
                            ]}
                            onPress={() => setShowTimePicker(true)}
                        >
                            <Text style={[
                                styles.dateButtonText,
                                !time && { color: '#ef4444', fontStyle: 'italic' } 
                            ]}>
                                {time 
                                    ? `⏰ ${time.toLocaleTimeString('es-ES', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}`
                                    : '⏰ Seleccionar hora del paseo'
                                }
                            </Text>
                        </TouchableOpacity>

                        {showTimePicker && (
                            <DateTimePicker
                                value={time || new Date()}
                                mode="time"
                                display="default"
                                onChange={onTimeChange}
                            />
                        )}
                    </View>
                </View>


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Descripción (opcional)</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Instrucciones especiales, preferencias del paseo..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                <PriceSummary
                    walkerSettings={walkerSettings}
                    selectedPets={selectedPets}
                    calculateFinalPrice={calculateFinalPrice}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        <Text style={styles.submitButtonText}>
                            {submitting ? 'Enviando...' : `Solicitar Paseo - $${calculateFinalPrice().toLocaleString()}`}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginLeft: 8,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    section: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 12,
    },
    walkerCard: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    walkerImage: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 12,
    },
    walkerInfo: {
        flex: 1,
    },
    walkerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    walkerName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
    },
    badges: {
        flexDirection: 'row',
        gap: 6,
    },
    walkerLocation: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    walkerLocationText: {
        fontSize: 13,
        color: '#6b7280',
        marginLeft: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    detailBox: {
        flex: 1,
        backgroundColor: '#eef2ff',
        padding: 12,
        borderRadius: 8,
    },
    detailLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
    },
    gpsActive: {
        color: '#10b981',
    },
    gpsInactive: {
        color: '#9ca3af',
    },
    petItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    petImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    petInfo: {
        flex: 1,
    },
    petName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    petDetails: {
        flexDirection: 'row',
        marginTop: 2,
    },
    petDetail: {
        fontSize: 12,
        color: '#6b7280',
        marginRight: 8,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    required: {
        color: '#ef4444',
    },
    dateButton: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
    },
    dateButtonEmpty: {
        borderColor: '#fca5a5',
        borderWidth: 1.5,
        backgroundColor: '#fef2f2',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#1f2937',
    },
    dateButtonTextPlaceholder: {
        color: '#9ca3af',
        fontStyle: 'italic',
    },
    textArea: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1f2937',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        marginTop: 8,
    },
    submitButton: {
        backgroundColor: '#6366f1',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});