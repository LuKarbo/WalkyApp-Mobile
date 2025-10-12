import { format } from 'date-fns';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MyTripsCardComponent({ trip, onViewTrip, onCancelTrip, onPayTrip, onCreateReview, onViewReview }) {
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
            case "Cancelado":
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
            case "Cancelado":
                return "Cancelado";
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

    const canCancel = (status) => {
        return ["Solicitado", "Esperando pago"].includes(status);
    };

    const needsPayment = (status) => {
        return status === "Esperando pago";
    };

    const canViewTrip = (status) => {
        return ["Agendado", "Activo", "Finalizado"].includes(status);
    };

    const isFinished = (status) => {
        return status === "Finalizado";
    };

    const hasReview = trip.hasReview || false;

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{trip.dogName?.[0] || 'P'}</Text>
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.dogName}>{trip.dogName}</Text>
                        <Text style={styles.walker}>🚶 {trip.walker}</Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(trip.status)}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcon}>📅</Text>
                    <Text style={styles.infoText}>
                        {format(new Date(trip.startTime), "MMM dd, yyyy")}
                    </Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoIcon}>⏰</Text>
                    <Text style={styles.infoText}>
                        {format(new Date(trip.startTime), "h:mm a")}
                        {trip.endTime && ` - ${format(new Date(trip.endTime), "h:mm a")}`}
                    </Text>
                </View>

                {(trip.duration || trip.distance) && (
                    <View style={styles.infoCard}>
                        <Text style={styles.infoIcon}>📍</Text>
                        <Text style={styles.infoText}>
                            {trip.duration && `${trip.duration} min`}
                            {trip.duration && trip.distance && ' • '}
                            {trip.distance && formatDistance(trip.distance)}
                        </Text>
                    </View>
                )}

                {trip.totalPrice && needsPayment(trip.status) && (
                    <View style={[styles.infoCard, styles.priceCard]}>
                        <Text style={styles.infoIcon}>💳</Text>
                        <Text style={styles.priceText}>
                            Total: ${trip.totalPrice.toLocaleString()}
                        </Text>
                    </View>
                )}

                {trip.notes && (
                    <View style={styles.notesCard}>
                        <Text style={styles.notesText} numberOfLines={3}>
                            &quot;{trip.notes}&quot;
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.cardActions}>
                {canViewTrip(trip.status) && (
                    <TouchableOpacity
                        onPress={() => onViewTrip(trip.id)}
                        style={[styles.button, styles.viewButton]}
                    >
                        <Text style={styles.viewButtonText}>👁️ Ver</Text>
                    </TouchableOpacity>
                )}
                
                {needsPayment(trip.status) && (
                    <TouchableOpacity
                        onPress={() => onPayTrip(trip)}
                        style={[styles.button, styles.payButton]}
                    >
                        <Text style={styles.payButtonText}>💳 Pagar</Text>
                    </TouchableOpacity>
                )}
                
                {canCancel(trip.status) && (
                    <TouchableOpacity
                        onPress={() => onCancelTrip(trip)}
                        style={[styles.button, styles.cancelButton]}
                    >
                        <Text style={styles.cancelButtonText}>❌ Cancelar</Text>
                    </TouchableOpacity>
                )}

                {isFinished(trip.status) && !hasReview && (
                    <TouchableOpacity
                        onPress={() => onCreateReview(trip)}
                        style={[styles.button, styles.reviewButton]}
                    >
                        <Text style={styles.reviewButtonText}>⭐ Dejar Review</Text>
                    </TouchableOpacity>
                )}

                {isFinished(trip.status) && hasReview && (
                    <TouchableOpacity
                        onPress={() => onViewReview(trip)}
                        style={[styles.button, styles.viewReviewButton]}
                    >
                        <Text style={styles.viewReviewButtonText}>⭐ Ver Review</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(59, 130, 246, 0.1)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    avatarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    headerInfo: {
        flex: 1,
    },
    dogName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    walker: {
        fontSize: 12,
        color: '#6b7280',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '700',
    },
    cardBody: {
        gap: 12,
        marginBottom: 16,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        padding: 12,
        borderRadius: 12,
    },
    priceCard: {
        backgroundColor: '#fff7ed',
        borderWidth: 1,
        borderColor: '#fed7aa',
    },
    infoIcon: {
        fontSize: 14,
        marginRight: 8,
    },
    infoText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#374151',
        flex: 1,
    },
    priceText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#ea580c',
        flex: 1,
    },
    notesCard: {
        backgroundColor: '#f9fafb',
        padding: 12,
        borderRadius: 12,
    },
    notesText: {
        fontSize: 11,
        color: '#6b7280',
        fontStyle: 'italic',
    },
    cardActions: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    button: {
        flex: 1,
        minWidth: 100,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewButton: {
        borderColor: '#3b82f6',
        backgroundColor: 'transparent',
    },
    viewButtonText: {
        color: '#3b82f6',
        fontSize: 12,
        fontWeight: '700',
    },
    payButton: {
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
    },
    payButtonText: {
        color: '#f59e0b',
        fontSize: 12,
        fontWeight: '700',
    },
    cancelButton: {
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
    },
    cancelButtonText: {
        color: '#ef4444',
        fontSize: 12,
        fontWeight: '700',
    },
    reviewButton: {
        borderColor: '#eab308',
        backgroundColor: 'transparent',
    },
    reviewButtonText: {
        color: '#d97706',
        fontSize: 12,
        fontWeight: '700',
    },
    viewReviewButton: {
        borderColor: '#10b981',
        backgroundColor: 'transparent',
    },
    viewReviewButtonText: {
        color: '#059669',
        fontSize: 12,
        fontWeight: '700',
    },
});