import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

import { ReviewsController } from "../../backend/Controllers/ReviewsController";
import { WalksController } from "../../backend/Controllers/WalksController";
import { useAuth } from "../../hooks/useAuth";

import ViewReviewModal from "../../components/client/MyWalks/modals/ViewReviewModal";
import WalkerWalksCard from "../../components/walker/WalkerWalks/components/WalkerWalksCard";
import WalkerWalksHeader from "../../components/walker/WalkerWalks/components/WalkerWalksHeader";
import WalkerWalksFilter from "../../components/walker/WalkerWalks/filters/WalkerWalksFilter";
import AcceptWalkModal from "../../components/walker/WalkerWalks/modals/AcceptWalkModal";
import FinishWalkModal from "../../components/walker/WalkerWalks/modals/FinishWalkModal";
import RejectWalkModal from "../../components/walker/WalkerWalks/modals/RejectWalkModal";
import StartWalkModal from "../../components/walker/WalkerWalks/modals/StartWalkModal";
import WaitingPaymentModal from "../../components/walker/WalkerWalks/modals/WaitingPaymentModal";

const WalkerWalksScreen = () => {
    const [allWalks, setAllWalks] = useState([]);
    const [displayedWalks, setDisplayedWalks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("requests");
    const [searchQuery, setSearchQuery] = useState("");

    // Estados de filtros avanzados
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [sortBy, setSortBy] = useState('date-desc');

    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showWaitingPaymentModal, setShowWaitingPaymentModal] = useState(false);
    const [showStartWalkModal, setShowStartWalkModal] = useState(false);
    const [showFinishWalkModal, setShowFinishWalkModal] = useState(false);
    const [showViewReviewModal, setShowViewReviewModal] = useState(false);

    const [selectedWalk, setSelectedWalk] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [walkToViewReview, setWalkToViewReview] = useState(null);
    const [currentReview, setCurrentReview] = useState(null);

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
            
            // Cargar información de reviews para paseos finalizados
            const walksWithReviews = await Promise.all(
                walksData.map(async (walk) => {
                    if (walk.status === 'Finalizado') {
                        try {
                            const review = await ReviewsController.fetchReviewByWalkId(walk.id);
                            const hasValidReview = review && 
                                                   typeof review === 'object' && 
                                                   !Array.isArray(review) && 
                                                   review.id;
                            return { 
                                ...walk, 
                                hasReview: hasValidReview, 
                                reviewId: hasValidReview ? review.id : null 
                            };
                        } catch (err) {
                            return { ...walk, hasReview: false, reviewId: null };
                        }
                    }
                    return walk;
                })
            );
            
            setAllWalks(walksWithReviews);
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
        return allWalks.filter((walk) =>
            ["Esperando pago", "Agendado"].includes(walk.status)
        ).length;
    };

    const countActiveWalks = () => {
        return allWalks.filter((walk) => walk.status === "Activo").length;
    };

    const canAcceptWalk = () => {
        const acceptedCount = countAcceptedWalks();
        return acceptedCount < MAX_ACCEPTED_WALKS;
    };

    const canStartWalk = () => {
        const activeCount = countActiveWalks();
        return activeCount < MAX_ACTIVE_WALKS;
    };

    // Función para aplicar filtros y ordenamiento
    const applyFiltersAndSort = useCallback((walks) => {
        let filtered = [...walks];

        // Filtro por tab (requests/active/history)
        filtered = filtered.filter(walk => {
            switch (activeTab) {
                case "requests":
                    return ["Solicitado", "Esperando pago", "Agendado"].includes(walk.status);
                case "active":
                    return walk.status === "Activo";
                case "history":
                    return ["Cancelado", "Finalizado", "Rechazado"].includes(walk.status);
                default:
                    return false;
            }
        });

        // Filtro por búsqueda
        if (searchQuery) {
            filtered = filtered.filter(walk =>
                walk.dogName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                walk.notes?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtro por estado específico
        if (selectedStatus) {
            filtered = filtered.filter(walk => walk.status === selectedStatus);
        }

        // Ordenamiento
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date-desc':
                    return new Date(b.startTime) - new Date(a.startTime);
                case 'date-asc':
                    return new Date(a.startTime) - new Date(b.startTime);
                case 'price-desc':
                    return (b.totalPrice || 0) - (a.totalPrice || 0);
                case 'price-asc':
                    return (a.totalPrice || 0) - (b.totalPrice || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [activeTab, searchQuery, selectedStatus, sortBy]);

    // Actualizar walks mostrados cuando cambian los filtros
    useEffect(() => {
        const filtered = applyFiltersAndSort(allWalks);
        setDisplayedWalks(filtered);
    }, [allWalks, applyFiltersAndSort]);

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
            setAllWalks(
                allWalks.map((walk) =>
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
            setAllWalks(
                allWalks.map((walk) =>
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
            setAllWalks(
                allWalks.map((walk) =>
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
            setAllWalks(
                allWalks.map((walk) =>
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

    const handleViewReview = async (walk) => {
        try {
            setWalkToViewReview(walk);
            const review = await ReviewsController.fetchReviewByWalkId(walk.id);
            const hasValidReview = review && 
                                   typeof review === 'object' && 
                                   !Array.isArray(review) && 
                                   review.id;
            if (hasValidReview) {
                setCurrentReview(review);
                setShowViewReviewModal(true);
            } else {
                Alert.alert('Info', 'Este paseo aún no tiene una reseña');
            }
        } catch (err) {
            setError('Error loading review: ' + err.message);
            Alert.alert('Error', 'No se pudo cargar la reseña');
        }
    };

    const handleCloseViewReviewModal = () => {
        setShowViewReviewModal(false);
        setWalkToViewReview(null);
        setCurrentReview(null);
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

    const requestsCount = allWalks.filter((walk) =>
        ["Solicitado", "Esperando pago", "Agendado"].includes(walk.status)
    ).length;

    const activeCount = allWalks.filter((walk) => walk.status === "Activo").length;

    const historyCount = allWalks.filter((walk) =>
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
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    activeTab={activeTab}
                />

                {displayedWalks.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>🐕</Text>
                        <Text style={styles.emptyTitle}>
                            {searchQuery ? 'No se encontraron resultados' :
                                activeTab === "requests" && "No tienes solicitudes pendientes"}
                            {activeTab === "active" && "No tienes paseos activos"}
                            {activeTab === "history" && "No hay paseos en el historial"}
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            {searchQuery ? 'Intenta con otra búsqueda' :
                                activeTab === "requests" && "Las nuevas solicitudes aparecerán aquí"}
                            {activeTab === "active" && "Los paseos en progreso aparecerán aquí"}
                            {activeTab === "history" && "Tus paseos completados aparecerán aquí"}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.cardsContainer}>
                        {displayedWalks.map((walk) => (
                            <WalkerWalksCard
                                key={walk.id}
                                walk={walk}
                                onAcceptWalk={handleAcceptWalk}
                                onRejectWalk={handleRejectWalk}
                                onShowWaitingPayment={handleShowWaitingPayment}
                                onStartWalk={handleStartWalk}
                                onViewWalk={handleViewWalk}
                                onFinishWalk={handleFinishWalk}
                                onViewReview={handleViewReview}
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

            <ViewReviewModal 
                visible={showViewReviewModal}
                onClose={handleCloseViewReviewModal}
                reviewData={currentReview}
                tripData={walkToViewReview}
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
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
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