import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const WaitingPaymentModal = ({ isOpen, onClose, walkData }) => {
    if (!isOpen) return null;

    const formatDistance = (distance) => {
        if (!distance) return null;
        return distance >= 1000
        ? `${(distance / 1000).toFixed(1)} km`
        : `${distance} m`;
    };

    return (
        <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
        >
        <View style={styles.overlay}>
            <View style={styles.modalContainer}>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
            >
                <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Ionicons name="information-circle" size={28} color="#ffffff" />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.title}>Esperando Confirmación de Pago</Text>
                    <Text style={styles.subtitle}>
                    Estado actual del servicio
                    </Text>
                </View>
                </View>

                {walkData && (
                <View style={styles.walkCard}>
                    <View style={styles.walkStatusBadge}>
                    <Text style={styles.walkStatusText}>Esperando Pago</Text>
                    </View>

                    <View style={styles.walkHeader}>
                    <View style={styles.walkAvatar}>
                        <Text style={styles.walkAvatarText}>
                        {walkData.dogName?.[0] || "P"}
                        </Text>
                    </View>
                    <View style={styles.walkHeaderInfo}>
                        <Text style={styles.walkDogName} numberOfLines={1}>
                        {walkData.dogName}
                        </Text>
                        <View style={styles.walkSubtitleRow}>
                        <Ionicons name="location-outline" size={10} color="#6b7280" />
                        <Text style={styles.walkSubtitle}>Servicio aceptado</Text>
                        </View>
                    </View>
                    </View>

                    <View style={styles.walkDetails}>
                    <View style={styles.walkDetailItem}>
                        <Ionicons name="calendar-outline" size={12} color="#10b981" />
                        <Text style={styles.walkDetailText} numberOfLines={1}>
                        {format(new Date(walkData.startTime), "MMM dd, yyyy")}
                        </Text>
                    </View>

                    <View style={styles.walkDetailItem}>
                        <Ionicons name="time-outline" size={12} color="#3b82f6" />
                        <Text style={styles.walkDetailText} numberOfLines={1}>
                        {format(new Date(walkData.startTime), "h:mm a")}
                        {walkData.endTime &&
                            ` - ${format(new Date(walkData.endTime), "h:mm a")}`}
                        </Text>
                    </View>

                    {(walkData.duration || walkData.distance) && (
                        <View style={styles.walkDetailItem}>
                        <Ionicons name="map-outline" size={12} color="#06b6d4" />
                        <Text style={styles.walkDetailText} numberOfLines={1}>
                            {walkData.duration && `${walkData.duration} min`}
                            {walkData.duration && walkData.distance && " • "}
                            {walkData.distance && formatDistance(walkData.distance)}
                        </Text>
                        </View>
                    )}

                    {walkData.notes && (
                        <View style={styles.walkNotes}>
                        <Text style={styles.walkNotesText} numberOfLines={2}>
                            &quot;{walkData.notes}&quot;
                        </Text>
                        </View>
                    )}
                    </View>
                </View>
                )}

                <View style={styles.statusContainer}>
                <View style={styles.statusHeader}>
                    <Ionicons name="card-outline" size={20} color="#f97316" />
                    <Text style={styles.statusTitle}>Estado del Pago</Text>
                </View>

                <View style={styles.statusList}>
                    <View style={styles.statusItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                    <Text style={styles.statusItemText}>
                        Has aceptado exitosamente la solicitud de paseo
                    </Text>
                    </View>

                    <View style={styles.statusItem}>
                    <Ionicons name="mail-outline" size={16} color="#10b981" />
                    <Text style={styles.statusItemText}>
                        El cliente ha sido notificado por email
                    </Text>
                    </View>

                    <View style={styles.statusItem}>
                    <Ionicons name="card-outline" size={16} color="#f97316" />
                    <Text style={styles.statusItemText}>
                        Esperando confirmación del pago del cliente
                    </Text>
                    </View>
                </View>
                </View>

                <View style={styles.messageContainer}>
                <Text style={styles.messageTitle}>
                    El cliente debe proceder con el pago para confirmar el servicio.
                </Text>
                <Text style={styles.messageText}>
                    Una vez que el pago sea confirmado, el estado cambiará a &quot;Agendado&quot; y podrás iniciar el paseo en la fecha programada.
                </Text>
                </View>

                <TouchableOpacity
                style={styles.confirmButton}
                onPress={onClose}
                >
                <Text style={styles.confirmButtonText}>Entendido</Text>
                </TouchableOpacity>
            </ScrollView>
            </View>
        </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    modalContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 24,
        width: "100%",
        maxWidth: 500,
        maxHeight: "90%",
    },
    closeButton: {
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#f97316",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: "#6b7280",
    },
    walkCard: {
        backgroundColor: "#f9fafb",
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "rgba(249, 115, 22, 0.1)",
    },
    walkStatusBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        backgroundColor: "#f97316",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    walkStatusText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#ffffff",
    },
    walkHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    walkAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#10b981",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    walkAvatarText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#ffffff",
    },
    walkHeaderInfo: {
        flex: 1,
    },
    walkDogName: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 2,
    },
    walkSubtitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    walkSubtitle: {
        fontSize: 11,
        color: "#6b7280",
        fontWeight: "500",
        marginLeft: 4,
    },
    walkDetails: {
        gap: 8,
    },
    walkDetailItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderRadius: 8,
        padding: 8,
        gap: 8,
    },
    walkDetailText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#1f2937",
        flex: 1,
    },
    walkNotes: {
        backgroundColor: "rgba(107, 114, 128, 0.1)",
        borderRadius: 8,
        padding: 8,
    },
    walkNotesText: {
        fontSize: 11,
        color: "#6b7280",
        fontStyle: "italic",
    },
    statusContainer: {
        backgroundColor: "#fff7ed",
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: "#fed7aa",
    },
    statusHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        gap: 8,
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#9a3412",
    },
    statusList: {
        gap: 12,
    },
    statusItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    statusItemText: {
        fontSize: 14,
        color: "#9a3412",
        flex: 1,
    },
    messageContainer: {
        marginBottom: 24,
    },
    messageTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1f2937",
        textAlign: "center",
        marginBottom: 8,
    },
    messageText: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
        lineHeight: 20,
    },
    confirmButton: {
        backgroundColor: "#f97316",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#ffffff",
    },
});

export default WaitingPaymentModal;