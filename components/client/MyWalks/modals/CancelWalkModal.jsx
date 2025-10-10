import { format } from 'date-fns';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function CancelWalkModal({ visible, onClose, onConfirm, tripData, isLoading }) {
    if (!tripData) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case "Solicitado":
                return '#3b82f6';
            case "Esperando pago":
                return '#f59e0b';
            case "Agendado":
                return '#eab308';
            case "Activo":
                return '#10b981';
            case "Finalizado":
                return '#6b7280';
            case "Rechazado":
                return '#ef4444';
            default:
                return '#9ca3af';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "Solicitado":
                return "Solicitado";
            case "Esperando pago":
                return "Esperando Pago";
            case "Agendado":
                return "Agendado";
            case "Activo":
                return "En Progreso";
            case "Finalizado":
                return "Finalizado";
            case "Rechazado":
                return "Rechazado";
            default:
                return status;
        }
    };

    const formatDistance = (distance) => {
        if (!distance) return null;
        return distance >= 1000 ? 
            `${(distance / 1000).toFixed(1)} km` : 
            `${distance} m`;
    };

    const getCancelMessage = (status) => {
        switch (status) {
            case "Solicitado":
                return "Al cancelar esta solicitud, el paseador no podrá aceptarla.";
            case "Esperando pago":
                return "Al cancelar ahora, perderás la aceptación del paseador y deberás crear una nueva solicitud.";
            default:
                return "Una vez cancelado, deberás crear un nuevo paseo si deseas programar otro servicio.";
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <TouchableOpacity
                            onPress={onClose}
                            disabled={isLoading}
                            style={styles.closeButton}
                        >
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>

                        <View style={styles.header}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.icon}>❌</Text>
                            </View>
                            <View style={styles.headerText}>
                                <Text style={styles.title}>Cancelar Paseo</Text>
                                <Text style={styles.subtitle}>Esta acción no se puede deshacer</Text>
                            </View>
                        </View>

                        <View style={styles.tripCard}>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tripData.status) }]}>
                                <Text style={styles.statusText}>{getStatusText(tripData.status)}</Text>
                            </View>

                            <View style={styles.tripInfo}>
                                <View style={styles.avatarContainer}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{tripData.dogName?.[0] || 'P'}</Text>
                                    </View>
                                    <View style={styles.dogInfo}>
                                        <Text style={styles.dogName}>{tripData.dogName}</Text>
                                        <Text style={styles.walker}>📍 {tripData.walker}</Text>
                                    </View>
                                </View>

                                <View style={styles.details}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailIcon}>📅</Text>
                                        <Text style={styles.detailText}>
                                            {format(new Date(tripData.startTime), "MMM dd, yyyy")}
                                        </Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailIcon}>⏰</Text>
                                        <Text style={styles.detailText}>
                                            {format(new Date(tripData.startTime), "h:mm a")}
                                            {tripData.endTime && ` - ${format(new Date(tripData.endTime), "h:mm a")}`}
                                        </Text>
                                    </View>

                                    {(tripData.duration || tripData.distance) && (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailIcon}>📍</Text>
                                            <Text style={styles.detailText}>
                                                {tripData.duration && `${tripData.duration} min`}
                                                {tripData.duration && tripData.distance && ' • '}
                                                {tripData.distance && formatDistance(tripData.distance)}
                                            </Text>
                                        </View>
                                    )}

                                    {tripData.notes && (
                                        <View style={styles.notesContainer}>
                                            <Text style={styles.notesText} numberOfLines={2}>
                                                &quot;{tripData.notes}&quot;
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>

                        <View style={styles.messageContainer}>
                            <Text style={styles.messageTitle}>¿Estás seguro de que deseas cancelar este paseo?</Text>
                            <Text style={styles.messageText}>{getCancelMessage(tripData.status)}</Text>
                        </View>

                        <View style={styles.actions}>
                            <TouchableOpacity
                                onPress={onClose}
                                disabled={isLoading}
                                style={[styles.button, styles.keepButton]}
                            >
                                <Text style={styles.keepButtonText}>Mantener Paseo</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                onPress={onConfirm}
                                disabled={isLoading}
                                style={[styles.button, styles.cancelButton]}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <Text style={styles.cancelButtonText}>❌ Cancelar Paseo</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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
        padding: 20,
        width: '100%',
        maxHeight: '90%',
    },
    closeButton: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#6b7280',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 8,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#fee2e2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
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
        fontSize: 12,
        color: '#6b7280',
    },
    tripCard: {
        backgroundColor: '#f9fafb',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '700',
    },
    tripInfo: {
        gap: 12,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    dogInfo: {
        flex: 1,
    },
    dogName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 2,
    },
    walker: {
        fontSize: 11,
        color: '#6b7280',
    },
    details: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 8,
        borderRadius: 8,
    },
    detailIcon: {
        fontSize: 12,
        marginRight: 8,
    },
    detailText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#374151',
        flex: 1,
    },
    notesContainer: {
        backgroundColor: '#ffffff',
        padding: 8,
        borderRadius: 8,
    },
    notesText: {
        fontSize: 10,
        color: '#6b7280',
        fontStyle: 'italic',
    },
    messageContainer: {
        marginBottom: 20,
    },
    messageTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    messageText: {
        fontSize: 12,
        color: '#6b7280',
        textAlign: 'center',
    },
    actions: {
        gap: 12,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    keepButton: {
        borderColor: '#3b82f6',
        backgroundColor: 'transparent',
    },
    keepButtonText: {
        color: '#3b82f6',
        fontSize: 14,
        fontWeight: '700',
    },
    cancelButton: {
        borderColor: '#ef4444',
        backgroundColor: '#ef4444',
    },
    cancelButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
});