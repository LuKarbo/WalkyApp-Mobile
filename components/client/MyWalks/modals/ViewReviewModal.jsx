import { format } from 'date-fns';
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ViewReviewModal({ visible, onClose, reviewData, tripData }) {
    const renderStars = (rating) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <Text
                        key={star}
                        style={[
                            styles.star,
                            star <= rating && styles.starFilled
                        ]}
                    >
                        ★
                    </Text>
                ))}
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <Text style={styles.icon}>⭐</Text>
                        </View>
                        <View style={styles.headerText}>
                            <Text style={styles.title}>Tu Reseña</Text>
                            <Text style={styles.subtitle}>
                                Paseo con {tripData?.walker}
                            </Text>
                        </View>
                    </View>

                    {reviewData ? (
                        <View style={styles.body}>
                            <View style={styles.ratingCard}>
                                <View style={styles.ratingHeader}>
                                    <Text style={styles.ratingLabel}>Calificación</Text>
                                    {renderStars(reviewData.rating)}
                                </View>
                                <Text style={styles.dateText}>
                                    {format(new Date(reviewData.date), "dd 'de' MMMM, yyyy")}
                                </Text>
                            </View>

                            <View style={styles.contentCard}>
                                <Text style={styles.contentLabel}>Tu comentario</Text>
                                <Text style={styles.contentText}>{reviewData.content}</Text>
                            </View>

                            <View style={styles.petCard}>
                                <Text style={styles.petText}>
                                    Mascota: <Text style={styles.petName}>{reviewData.petName || tripData?.dogName}</Text>
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No se pudo cargar la reseña</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={onClose}
                        style={styles.closeActionButton}
                    >
                        <Text style={styles.closeActionButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    body: {
        gap: 16,
        marginBottom: 24,
    },
    ratingCard: {
        backgroundColor: '#fffbeb',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#fde68a',
    },
    ratingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    ratingLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    star: {
        fontSize: 20,
        color: '#d1d5db',
    },
    starFilled: {
        color: '#fbbf24',
    },
    dateText: {
        fontSize: 12,
        color: '#78716c',
    },
    contentCard: {
        backgroundColor: '#f9fafb',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    contentLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 8,
    },
    contentText: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    petCard: {
        backgroundColor: '#dbeafe',
        borderRadius: 16,
        padding: 16,
    },
    petText: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
    },
    petName: {
        fontWeight: '600',
        color: '#1f2937',
    },
    emptyState: {
        paddingVertical: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        color: '#6b7280',
    },
    closeActionButton: {
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeActionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
});