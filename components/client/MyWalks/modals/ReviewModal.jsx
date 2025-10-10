import { useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

export default function ReviewModal({ visible, onClose, onSubmit, tripData, isLoading }) {
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Por favor selecciona una calificación');
            return;
        }
        
        if (!content.trim()) {
            setError('Por favor escribe tu reseña');
            return;
        }

        setError('');
        await onSubmit({ id: tripData?.id, walkerId: tripData?.walker.id, rating, content });
    };

    const handleClose = () => {
        setRating(0);
        setContent('');
        setError('');
        Keyboard.dismiss();
        onClose();
    };

    const getRatingText = (r) => {
        switch (r) {
            case 1: return 'Muy malo';
            case 2: return 'Malo';
            case 3: return 'Regular';
            case 4: return 'Bueno';
            case 5: return 'Excelente';
            default: return '';
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <ScrollView 
                            contentContainerStyle={styles.scrollContainer}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.modalContainer}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={handleClose}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </TouchableOpacity>

                                <View style={styles.header}>
                                    <View style={styles.iconContainer}>
                                        <Text style={styles.icon}>⭐</Text>
                                    </View>
                                    <View style={styles.headerText}>
                                        <Text style={styles.title}>Dejar Reseña</Text>
                                        <Text style={styles.subtitle}>
                                            Califica tu experiencia con {tripData?.walker.name}
                                        </Text>
                                    </View>
                                </View>

                                {error ? (
                                    <View style={styles.errorContainer}>
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                ) : null}

                                <View style={styles.body}>
                                    <Text style={styles.label}>Calificación</Text>
                                    <View style={styles.starsContainer}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <TouchableOpacity
                                                key={star}
                                                onPress={() => setRating(star)}
                                                style={styles.starButton}
                                            >
                                                <Text style={[
                                                    styles.star,
                                                    star <= rating && styles.starFilled
                                                ]}>
                                                    ★
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                    {rating > 0 && (
                                        <Text style={styles.ratingText}>{getRatingText(rating)}</Text>
                                    )}

                                    <Text style={[styles.label, styles.labelMargin]}>Tu Reseña</Text>
                                    <TextInput
                                        value={content}
                                        onChangeText={setContent}
                                        placeholder="Cuéntanos sobre tu experiencia con el paseador..."
                                        placeholderTextColor="#9ca3af"
                                        multiline
                                        numberOfLines={5}
                                        textAlignVertical="top"
                                        style={styles.textArea}
                                        editable={!isLoading}
                                    />
                                    <Text style={styles.characterCount}>{content.length} caracteres</Text>
                                </View>

                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        onPress={handleClose}
                                        style={[styles.button, styles.cancelButton]}
                                        disabled={isLoading}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        style={[
                                            styles.button,
                                            styles.submitButton,
                                            (isLoading || rating === 0 || !content.trim()) && styles.buttonDisabled
                                        ]}
                                        disabled={isLoading || rating === 0 || !content.trim()}
                                    >
                                        {isLoading ? (
                                            <View style={styles.loadingContainer}>
                                                <ActivityIndicator color="#ffffff" size="small" />
                                                <Text style={styles.submitButtonText}>Enviando...</Text>
                                            </View>
                                        ) : (
                                            <Text style={styles.submitButtonText}>Enviar Reseña</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        width: '100%',
        maxWidth: 500,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    closeButtonText: {
        fontSize: 18,
        color: '#6b7280',
        fontWeight: '600',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fef3c7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        fontSize: 24,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
    },
    errorContainer: {
        backgroundColor: '#fee2e2',
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#b91c1c',
        fontSize: 13,
    },
    body: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 12,
    },
    labelMargin: {
        marginTop: 24,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 8,
    },
    starButton: {
        padding: 4,
    },
    star: {
        fontSize: 40,
        color: '#d1d5db',
    },
    starFilled: {
        color: '#fbbf24',
    },
    ratingText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#6b7280',
        marginTop: 8,
    },
    textArea: {
        borderWidth: 2,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        padding: 16,
        fontSize: 14,
        color: '#1f2937',
        backgroundColor: '#ffffff',
        minHeight: 120,
    },
    characterCount: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        borderWidth: 2,
        borderColor: '#d1d5db',
        backgroundColor: 'transparent',
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4b5563',
    },
    submitButton: {
        backgroundColor: '#f59e0b',
    },
    submitButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
});