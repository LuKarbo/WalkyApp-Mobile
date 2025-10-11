import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import { WalksController } from "../../backend/Controllers/WalksController";
import { useAuth } from "../../hooks/useAuth";

import WalkerWalksCard from "../../components/walker/WalkerWalks/components/WalkerWalksCard";
import WalkerWalksHeader from "../../components/walker/WalkerWalks/components/WalkerWalksHeader";
import WalkerWalksFilter from "../../components/walker/WalkerWalks/filters/WalkerWalksFilter";
import AcceptWalkModal from "../../components/walker/WalkerWalks/modals/AcceptWalkModal";
import FinishWalkModal from "../../components/walker/WalkerWalks/modals/FinishWalkModal";
import RejectWalkModal from "../../components/walker/WalkerWalks/modals/RejectWalkModal";
import StartWalkModal from "../../components/walker/WalkerWalks/modals/StartWalkModal";
import WaitingPaymentModal from "../../components/walker/WalkerWalks/modals/WaitingPaymentModal";

    const WalkerWalksScreen = () => {
    const [walks, setWalks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("requests");
    const [searchQuery, setSearchQuery] = useState("");

    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showWaitingPaymentModal, setShowWaitingPaymentModal] = useState(false);
    const [showStartWalkModal, setShowStartWalkModal] = useState(false);
    const [showFinishWalkModal, setShowFinishWalkModal] = useState(false);

    const [selectedWalk, setSelectedWalk] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const MAX_ACCEPTED_WALKS = 5;
    const MAX_ACTIVE_WALKS = 2;

    const { user } = useAuth();
    const walkerId = user?.id;

    const loadWalks = async () => {
        if (!walkerId) return;

        try {
        setLoading(true);
        setError(null);

        const walksData = await WalksController.fetchWalksByWalker(walkerId);
        setWalks(walksData);
        } catch (err) {
        setError("Error loading walks: " + err.message);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        loadWalks();
    }, [walkerId]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadWalks();
        setRefreshing(false);
    };

    const countAcceptedWalks = () => {
        return walks.filter((walk) =>
        ["Esperando pago", "Agendado"].includes(walk.status)
        ).length;
    };

    const countActiveWalks = () => {
        return walks.filter((walk) => walk.status === "Activo").length;
    };

    const canAcceptWalk = () => {
        const acceptedCount = countAcceptedWalks();
        return acceptedCount < MAX_ACCEPTED_WALKS;
    };

    const canStartWalk = () => {
        const activeCount = countActiveWalks();
        return activeCount < MAX_ACTIVE_WALKS;
    };

    const handleAcceptWalk = (walk) => {
        if (!canAcceptWalk()) {
        setError(
            `No puedes aceptar más paseos. Límite máximo: ${MAX_ACCEPTED_WALKS} paseos aceptados simultáneamente.`
        );
        return;
        }

        setSelectedWalk(walk);
        setShowAcceptModal(true);
    };

    const handleConfirmAccept = async () => {
        if (!selectedWalk) return;

        if (!canAcceptWalk()) {
        setError(
            `No puedes aceptar más paseos. Límite máximo: ${MAX_ACCEPTED_WALKS} paseos aceptados simultáneamente.`
        );
        setShowAcceptModal(false);
        setSelectedWalk(null);
        return;
        }

        try {
        setActionLoading(true);
        await WalksController.acceptWalkRequest(selectedWalk.id);
        setWalks(
            walks.map((walk) =>
            walk.id === selectedWalk.id
                ? { ...walk, status: "Esperando pago" }
                : walk
            )
        );
        setShowAcceptModal(false);
        setSelectedWalk(null);
        } catch (err) {
        setError("Error accepting walk: " + err.message);
        } finally {
        setActionLoading(false);
        }
    };

    const handleRejectWalk = (walk) => {
        setSelectedWalk(walk);
        setShowRejectModal(true);
    };

    const handleConfirmReject = async () => {
        if (!selectedWalk) return;

        try {
        setActionLoading(true);
        await WalksController.rejectWalkRequest(selectedWalk.id);
        setWalks(
            walks.map((walk) =>
            walk.id === selectedWalk.id ? { ...walk, status: "Rechazado" } : walk
            )
        );
        setShowRejectModal(false);
        setSelectedWalk(null);
        } catch (err) {
        setError("Error rejecting walk: " + err.message);
        } finally {
        setActionLoading(false);
        }
    };

    const handleFinishWalk = (walk) => {
        setSelectedWalk(walk);
        setShowFinishWalkModal(true);
    };

    const handleConfirmFinishWalk = async () => {
        if (!selectedWalk) return;

        if (selectedWalk.status !== "Activo") {
        setError("Solo los paseos activos pueden finalizarse.");
        return;
        }

        try {
        setActionLoading(true);
        await WalksController.finishWalk(selectedWalk.id);
        setWalks(
            walks.map((walk) =>
            walk.id === selectedWalk.id
                ? { ...walk, status: "Finalizado" }
                : walk
            )
        );
        setShowFinishWalkModal(false);
        setSelectedWalk(null);
        } catch (err) {
        setError("Error finishing walk: " + err.message);
        } finally {
        setActionLoading(false);
        }
    };

    const handleShowWaitingPayment = (walk) => {
        setSelectedWalk(walk);
        setShowWaitingPaymentModal(true);
    };

    const handleStartWalk = (walk) => {
        if (!canStartWalk()) {
        setError(
            `No puedes iniciar más paseos. Límite máximo: ${MAX_ACTIVE_WALKS} paseos activos simultáneamente.`
        );
        return;
        }

        setSelectedWalk(walk);
        setShowStartWalkModal(true);
    };

    const handleConfirmStartWalk = async () => {
        if (!selectedWalk) return;

        if (!canStartWalk()) {
        setError(
            `No puedes iniciar más paseos. Límite máximo: ${MAX_ACTIVE_WALKS} paseos activos simultáneamente.`
        );
        setShowStartWalkModal(false);
        setSelectedWalk(null);
        return;
        }

        try {
        setActionLoading(true);
        await WalksController.startWalk(selectedWalk.id);
        setWalks(
            walks.map((walk) =>
            walk.id === selectedWalk.id ? { ...walk, status: "Activo" } : walk
            )
        );
        setShowStartWalkModal(false);
        setSelectedWalk(null);
        } catch (err) {
        setError("Error starting walk: " + err.message);
        } finally {
        setActionLoading(false);
        }
    };

    const handleViewWalk = (walkId) => {
        Alert.alert('Ver Paseo', `Navegando a detalles del paseo ${walkId}`);
    };

    const handleCloseModals = () => {
        setShowAcceptModal(false);
        setShowRejectModal(false);
        setShowWaitingPaymentModal(false);
        setShowStartWalkModal(false);
        setShowFinishWalkModal(false);
        setSelectedWalk(null);
        setError(null);
    };

    const filteredWalks = walks.filter((walk) => {
        let isInTab = false;

        switch (activeTab) {
        case "requests":
            isInTab = ["Solicitado", "Esperando pago", "Agendado"].includes(
            walk.status
            );
            break;
        case "active":
            isInTab = walk.status === "Activo";
            break;
        case "history":
            isInTab = ["Cancelado", "Finalizado", "Rechazado"].includes(walk.status);
            break;
        default:
            isInTab = false;
        }

        const matchesSearch =
        walk.dogName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        walk.notes?.toLowerCase().includes(searchQuery.toLowerCase());

        return isInTab && matchesSearch;
    });

    const requestsCount = walks.filter((walk) =>
        ["Solicitado", "Esperando pago", "Agendado"].includes(walk.status)
    ).length;

    const activeCount = walks.filter((walk) => walk.status === "Activo").length;

    const historyCount = walks.filter((walk) =>
        ["Cancelado", "Finalizado", "Rechazado"].includes(walk.status)
    ).length;

    useEffect(() => {
        if (error) {
        const timer = setTimeout(() => {
            setError(null);
        }, 5000);
        return () => clearTimeout(timer);
        }
    }, [error]);

    if (loading) {
        return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10b981" />
            <Text style={styles.loadingText}>Cargando paseos...</Text>
        </View>
        );
    }

    return (
        <View style={styles.container}>
        <ScrollView
            refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
        >
            <WalkerWalksHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            requestsCount={requestsCount}
            activeCount={activeCount}
            historyCount={historyCount}
            />

            <View style={styles.limitsContainer}>
            <View style={styles.limitsContent}>
                <View style={styles.limitItem}>
                <Text style={styles.limitLabel}>Paseos Aceptados:</Text>
                <View
                    style={[
                    styles.limitBadge,
                    countAcceptedWalks() >= MAX_ACCEPTED_WALKS
                        ? styles.limitBadgeDanger
                        : styles.limitBadgeSuccess,
                    ]}
                >
                    <Text style={styles.limitBadgeText}>
                    {countAcceptedWalks()}/{MAX_ACCEPTED_WALKS}
                    </Text>
                </View>
                </View>
                <View style={styles.limitItem}>
                <Text style={styles.limitLabel}>Paseos Activos:</Text>
                <View
                    style={[
                    styles.limitBadge,
                    countActiveWalks() >= MAX_ACTIVE_WALKS
                        ? styles.limitBadgeDanger
                        : styles.limitBadgePrimary,
                    ]}
                >
                    <Text style={styles.limitBadgeText}>
                    {countActiveWalks()}/{MAX_ACTIVE_WALKS}
                    </Text>
                </View>
                </View>
            </View>
            <Text style={styles.limitsSubtext}>
                Límites de capacidad del paseador
            </Text>
            </View>

            {error && (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
            )}

            <WalkerWalksFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            />

            {filteredWalks.length === 0 ? (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>
                {activeTab === "requests" && "No tienes solicitudes pendientes"}
                {activeTab === "active" && "No tienes paseos activos"}
                {activeTab === "history" && "No hay paseos en el historial"}
                </Text>
                <Text style={styles.emptySubtitle}>
                {activeTab === "requests" && "Las nuevas solicitudes aparecerán aquí"}
                {activeTab === "active" && "Los paseos en progreso aparecerán aquí"}
                {activeTab === "history" && "Tus paseos completados aparecerán aquí"}
                </Text>
            </View>
            ) : (
            <View style={styles.cardsContainer}>
                {filteredWalks.map((walk) => (
                <WalkerWalksCard
                    key={walk.id}
                    walk={walk}
                    onAcceptWalk={handleAcceptWalk}
                    onRejectWalk={handleRejectWalk}
                    onShowWaitingPayment={handleShowWaitingPayment}
                    onStartWalk={handleStartWalk}
                    onViewWalk={handleViewWalk}
                    onFinishWalk={handleFinishWalk}
                    canAcceptMore={canAcceptWalk()}
                    canStartMore={canStartWalk()}
                />
                ))}
            </View>
            )}
        </ScrollView>

        <AcceptWalkModal
            isOpen={showAcceptModal}
            onClose={handleCloseModals}
            onConfirm={handleConfirmAccept}
            walkData={selectedWalk}
            isLoading={actionLoading}
        />

        <RejectWalkModal
            isOpen={showRejectModal}
            onClose={handleCloseModals}
            onConfirm={handleConfirmReject}
            walkData={selectedWalk}
            isLoading={actionLoading}
        />

        <WaitingPaymentModal
            isOpen={showWaitingPaymentModal}
            onClose={handleCloseModals}
            walkData={selectedWalk}
        />

        <StartWalkModal
            isOpen={showStartWalkModal}
            onClose={handleCloseModals}
            onConfirm={handleConfirmStartWalk}
            walkData={selectedWalk}
            isLoading={actionLoading}
        />

        <FinishWalkModal
            isOpen={showFinishWalkModal}
            onClose={handleCloseModals}
            onConfirm={handleConfirmFinishWalk}
            walkData={selectedWalk}
            isLoading={actionLoading}
        />
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#374151",
    },
    limitsContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#e0f2fe",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#bae6fd",
    },
    limitsContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    limitItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    limitLabel: {
        fontSize: 14,
        color: "#1f2937",
        fontWeight: "500",
    },
    limitBadge: {
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    limitBadgeSuccess: {
        backgroundColor: "#10b981",
    },
    limitBadgePrimary: {
        backgroundColor: "#3b82f6",
    },
    limitBadgeDanger: {
        backgroundColor: "#ef4444",
    },
    limitBadgeText: {
        color: "#ffffff",
        fontSize: 12,
        fontWeight: "700",
    },
    limitsSubtext: {
        fontSize: 12,
        color: "#6b7280",
        textAlign: "center",
    },
    errorContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#fef2f2",
        borderWidth: 1,
        borderColor: "#fecaca",
        borderRadius: 16,
        padding: 16,
    },
    errorText: {
        fontSize: 14,
        color: "#991b1b",
        fontWeight: "500",
    },
    emptyContainer: {
        alignItems: "center",
        paddingVertical: 64,
        paddingHorizontal: 32,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 8,
        textAlign: "center",
    },
    emptySubtitle: {
        fontSize: 14,
        color: "#6b7280",
        textAlign: "center",
    },
    cardsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
});

export default WalkerWalksScreen;