import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RequestWalkScreen() {
    const [dogName, setDogName] = useState('');
    const [breed, setBreed] = useState('');
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [duration, setDuration] = useState('30');
    const [notes, setNotes] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const durations = ['30', '60', '90', '120'];

    const handleSubmit = async () => {
        
        if (!dogName.trim()) {
            Alert.alert('Error', 'Por favor ingresa el nombre de tu perro');
            return;
        }

        try {
            setSubmitting(true);
            
            // Aquí iría la llamada a la API
            // await WalkController.createWalkRequest({
            //     dogName,
            //     breed,
            //     date,
            //     time,
            //     duration,
            //     notes
            // });

            // Simulación
            await new Promise(resolve => setTimeout(resolve, 1500));

            Alert.alert(
                'Solicitud Enviada',
                'Tu solicitud de paseo ha sido registrada correctamente',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Limpiar formulario
                            setDogName('');
                            setBreed('');
                            setDate(new Date());
                            setTime(new Date());
                            setDuration('30');
                            setNotes('');
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Error enviando solicitud:', error);
            Alert.alert('Error', 'No se pudo enviar la solicitud');
        } finally {
            setSubmitting(false);
        }
    };

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

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Información del Perro</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>
                        Nombre del Perro <Text style={styles.required}>*</Text>
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: Max, Luna, Rocky..."
                        value={dogName}
                        onChangeText={setDogName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Raza (opcional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ej: Golden Retriever, Mestizo..."
                        value={breed}
                        onChangeText={setBreed}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Detalles del Paseo</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Fecha</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.dateButtonText}>
                            📅 {date.toLocaleDateString('es-ES', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                            minimumDate={new Date()}
                        />
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Hora</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowTimePicker(true)}
                    >
                        <Text style={styles.dateButtonText}>
                            ⏰ {time.toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                        <DateTimePicker
                            value={time}
                            mode="time"
                            display="default"
                            onChange={onTimeChange}
                        />
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Duración (minutos)</Text>
                    <View style={styles.durationContainer}>
                        {durations.map((dur) => (
                            <TouchableOpacity
                                key={dur}
                                style={[
                                    styles.durationButton,
                                    duration === dur && styles.durationButtonActive,
                                ]}
                                onPress={() => setDuration(dur)}
                            >
                                <Text
                                    style={[
                                        styles.durationButtonText,
                                        duration === dur && styles.durationButtonTextActive,
                                    ]}
                                >
                                    {dur} min
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Notas adicionales (opcional)</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Información adicional sobre tu perro..."
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>
            </View>

            <TouchableOpacity
                style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={submitting}
            >
                <Text style={styles.submitButtonText}>
                    {submitting ? 'Enviando...' : 'Solicitar Paseo'}
                </Text>
            </TouchableOpacity>
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
    section: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16,
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
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#1f2937',
    },
    textArea: {
        minHeight: 100,
    },
    dateButton: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#1f2937',
    },
    durationContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    durationButton: {
        flex: 1,
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    durationButtonActive: {
        backgroundColor: '#6366f1',
        borderColor: '#6366f1',
    },
    durationButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
    },
    durationButtonTextActive: {
        color: '#ffffff',
    },
    submitButton: {
        backgroundColor: '#6366f1',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 32,
    },
    submitButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});