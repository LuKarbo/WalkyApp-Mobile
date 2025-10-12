import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const WalkerWalksCard = ({
    walk,
    onAcceptWalk,
    onRejectWalk,
    onShowWaitingPayment,
    onStartWalk,
    onViewWalk,
    onFinishWalk,
    canAcceptMore = true,
    canStartMore = true,
}) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "Solicitado":
                return "#3b82f6";
            case "Esperando pago":
                return "#f97316";
            case "Agendado":
                return "#eab308";
            case "Activo":
                return "#10b981";
            case "Finalizado":
                return "#6b7280";
            case "Rechazado":
                return "#ef4444";
            case "Cancelado":
                return "#ef4444";
            default:
                return "#9ca3af";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "Solicitado":
                return "Nuevo";
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
        return distance >= 1000
            ? `${(distance / 1000).toFixed(1)} km`
            : `${distance} m`;
    };

    const renderActionButtons = () => {
        switch (walk.status) {
            case "Solicitado":
                return (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                styles.acceptButton,
                                !canAcceptMore && styles.disabledButton,
                            ]}
                            onPress={() => canAcceptMore && onAcceptWalk(walk)}
                            disabled={!canAcceptMore}
                        >
                            <Ionicons
                                name="checkmark"
                                size={14}
                                color="#ffffff"
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.actionButtonText}>
                                {canAcceptMore ? "Aceptar" : "Límite"}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.rejectButton]}
                            onPress={() => onRejectWalk(walk)}
                        >
                            <Ionicons
                                name="close"
                                size={14}
                                color="#ef4444"
                                style={styles.buttonIcon}
                            />
                            <Text style={[styles.actionButtonText, styles.rejectButtonText]}>
                                Rechazar
                            </Text>
                        </TouchableOpacity>
                    </View>
                );

            case "Esperando pago":
                return (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.infoButton]}
                            onPress={() => onShowWaitingPayment(walk)}
                        >
                            <Ionicons
                                name="information-circle-outline"
                                size={14}
                                color="#3b82f6"
                                style={styles.buttonIcon}
                            />
                            <Text style={[styles.actionButtonText, styles.infoButtonText]}>
                                Info
                            </Text>
                        </TouchableOpacity>
                    </View>
                );

            case "Agendado":
                return (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                styles.startButton,
                                !canStartMore && styles.disabledButton,
                            ]}
                            onPress={() => canStartMore && onStartWalk(walk)}
                            disabled={!canStartMore}
                        >
                            <Ionicons
                                name="play"
                                size={14}
                                color="#ffffff"
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.actionButtonText}>
                                {canStartMore ? "Iniciar Paseo" : "Límite Activos"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );

            case "Activo":
                return (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.viewButton]}
                            onPress={() => onViewWalk(walk.id)}
                        >
                            <Ionicons
                                name="eye-outline"
                                size={14}
                                color="#10b981"
                                style={styles.buttonIcon}
                            />
                            <Text style={[styles.actionButtonText, styles.viewButtonText]}>
                                Ver Paseo
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.finishButton]}
                            onPress={() => onFinishWalk(walk)}
                        >
                            <Ionicons
                                name="checkmark-circle-outline"
                                size={14}
                                color="#ffffff"
                                style={styles.buttonIcon}
                            />
                            <Text style={styles.actionButtonText}>Finalizar</Text>
                        </TouchableOpacity>
                    </View>
                );

            case "Finalizado":
                return (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.viewButton]}
                            onPress={() => onViewWalk(walk.id)}
                        >
                            <Ionicons
                                name="eye-outline"
                                size={14}
                                color="#10b981"
                                style={styles.buttonIcon}
                            />
                            <Text style={[styles.actionButtonText, styles.viewButtonText]}>
                                Ver Paseo
                            </Text>
                        </TouchableOpacity>
                    </View>
                );

            case "Rechazado":
            case "Cancelado":
            default:
                return null;
        }
    };

    const isLimitReached = (!canAcceptMore && walk.status === "Solicitado") 
        || (!canStartMore && walk.status === "Agendado");

    return (
        <View
            style={[
                styles.card,
                isLimitReached && styles.cardDisabled,
            ]}
        >
            <View style={styles.statusBadge}>
                <Text
                    style={[
                        styles.statusText,
                        { backgroundColor: getStatusColor(walk.status) },
                    ]}
                >
                    {getStatusText(walk.status)}
                </Text>
            </View>

            {isLimitReached && (
                <View style={styles.limitBadge}>
                    <Text style={styles.limitBadgeText}>Límite</Text>
                </View>
            )}

            <View style={styles.header}>
                <View
                    style={[
                        styles.avatar,
                        { backgroundColor: getStatusColor(walk.status) },
                    ]}
                >
                    <Text style={styles.avatarText}>
                        {walk.dogName?.[0] || "P"}
                    </Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text
                        style={[
                            styles.dogName,
                            isLimitReached && styles.dogNameDisabled,
                        ]}
                        numberOfLines={1}
                    >
                        {walk.dogName}
                    </Text>
                    <View style={styles.subtitleRow}>
                        <Ionicons name="location-outline" size={12} color="#6b7280" />
                        <Text style={styles.subtitle} numberOfLines={1}>
                            Solicitud de paseo
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.detailItem}>
                    <Ionicons
                        name="calendar-outline"
                        size={14}
                        color="#10b981"
                        style={styles.detailIcon}
                    />
                    <Text style={styles.detailText} numberOfLines={1}>
                        {format(new Date(walk.startTime), "MMM dd, yyyy")}
                    </Text>
                </View>

                <View style={styles.detailItem}>
                    <Ionicons
                        name="time-outline"
                        size={14}
                        color="#3b82f6"
                        style={styles.detailIcon}
                    />
                    <Text style={styles.detailText} numberOfLines={1}>
                        {format(new Date(walk.startTime), "h:mm a")}
                        {walk.endTime && ` - ${format(new Date(walk.endTime), "h:mm a")}`}
                    </Text>
                </View>

                {(walk.duration || walk.distance) && (
                    <View style={styles.detailItem}>
                        <Ionicons
                            name="map-outline"
                            size={14}
                            color="#06b6d4"
                            style={styles.detailIcon}
                        />
                        <Text style={styles.detailText} numberOfLines={1}>
                            {walk.duration && `${walk.duration} min`}
                            {walk.duration && walk.distance && " • "}
                            {walk.distance && formatDistance(walk.distance)}
                        </Text>
                    </View>
                )}

                {walk.notes && (
                    <View style={styles.notesContainer}>
                        <Text style={styles.notesText} numberOfLines={2}>
                            &quot;{walk.notes}&quot;
                        </Text>
                    </View>
                )}

                {walk.status === "Esperando pago" && (
                    <View style={styles.waitingPaymentBadge}>
                        <Ionicons
                            name="information-circle-outline"
                            size={14}
                            color="#f97316"
                            style={styles.detailIcon}
                        />
                        <Text style={styles.waitingPaymentText} numberOfLines={1}>
                            Cliente notificado - Esperando pago
                        </Text>
                    </View>
                )}

                {!canAcceptMore && walk.status === "Solicitado" && (
                    <View style={styles.limitWarning}>
                        <Ionicons
                            name="information-circle-outline"
                            size={14}
                            color="#ef4444"
                            style={styles.detailIcon}
                        />
                        <Text style={styles.limitWarningText} numberOfLines={1}>
                            Límite de 5 paseos aceptados alcanzado
                        </Text>
                    </View>
                )}

                {!canStartMore && walk.status === "Agendado" && (
                    <View style={styles.limitWarning}>
                        <Ionicons
                            name="information-circle-outline"
                            size={14}
                            color="#ef4444"
                            style={styles.detailIcon}
                        />
                        <Text style={styles.limitWarningText} numberOfLines={1}>
                            Límite de 2 paseos activos alcanzado
                        </Text>
                    </View>
                )}
            </View>

            {renderActionButtons()}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "rgba(16, 185, 129, 0.1)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    cardDisabled: {
        backgroundColor: "#f9fafb",
        opacity: 0.8,
    },
    statusBadge: {
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 10,
    },
    statusText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#ffffff",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        overflow: "hidden",
    },
    limitBadge: {
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 10,
        backgroundColor: "#ef4444",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    limitBadgeText: {
        fontSize: 11,
        fontWeight: "700",
        color: "#ffffff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#ffffff",
    },
    headerInfo: {
        flex: 1,
    },
    dogName: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 4,
    },
    dogNameDisabled: {
        color: "#6b7280",
    },
    subtitleRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    subtitle: {
        fontSize: 12,
        color: "#6b7280",
        fontWeight: "500",
        marginLeft: 4,
        flex: 1,
    },
    details: {
        marginBottom: 16,
    },
    detailItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderRadius: 12,
        padding: 10,
        marginBottom: 8,
    },
    detailIcon: {
        marginRight: 8,
    },
    detailText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#1f2937",
        flex: 1,
    },
    notesContainer: {
        backgroundColor: "rgba(107, 114, 128, 0.1)",
        borderRadius: 12,
        padding: 10,
        marginBottom: 8,
    },
    notesText: {
        fontSize: 12,
        color: "#6b7280",
        fontStyle: "italic",
    },
    waitingPaymentBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff7ed",
        borderRadius: 12,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#fed7aa",
    },
    waitingPaymentText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#9a3412",
        flex: 1,
    },
    limitWarning: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fef2f2",
        borderRadius: 12,
        padding: 10,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#fecaca",
    },
    limitWarningText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#991b1b",
        flex: 1,
    },
    actionsContainer: {
        flexDirection: "row",
        gap: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 2,
    },
    buttonIcon: {
        marginRight: 4,
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#ffffff",
    },
    acceptButton: {
        backgroundColor: "#10b981",
        borderColor: "#10b981",
    },
    rejectButton: {
        backgroundColor: "transparent",
        borderColor: "#ef4444",
    },
    rejectButtonText: {
        color: "#ef4444",
    },
    infoButton: {
        backgroundColor: "transparent",
        borderColor: "#3b82f6",
    },
    infoButtonText: {
        color: "#3b82f6",
    },
    startButton: {
        backgroundColor: "#3b82f6",
        borderColor: "#3b82f6",
    },
    viewButton: {
        backgroundColor: "transparent",
        borderColor: "#10b981",
    },
    viewButtonText: {
        color: "#10b981",
    },
    finishButton: {
        backgroundColor: "#ef4444",
        borderColor: "#ef4444",
    },
    disabledButton: {
        backgroundColor: "#9ca3af",
        borderColor: "#9ca3af",
        opacity: 0.6,
    },
});

export default WalkerWalksCard;