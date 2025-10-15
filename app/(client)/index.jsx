import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { useToast } from "../../backend/Context/ToastContext";
import { ReviewsController } from '../../backend/Controllers/ReviewsController';
import { WalksController } from '../../backend/Controllers/WalksController';
import MyTripsCardComponent from '../../components/client/MyWalks/components/MyTripsCardComponent';
import MyTripsFilter from '../../components/client/MyWalks/components/MyTripsFilter';
import MyTripsHeaderComponent from '../../components/client/MyWalks/components/MyTripsHeaderComponent';
import CancelWalkModal from '../../components/client/MyWalks/modals/CancelWalkModal';
import PaymentModal from '../../components/client/MyWalks/modals/PaymentModal';
import ReviewModal from '../../components/client/MyWalks/modals/ReviewModal';
import ViewReviewModal from '../../components/client/MyWalks/modals/ViewReviewModal';
import LoadingScreen from '../../components/common/LoadingScreen';
import { useAuth } from '../../hooks/useAuth';

const ITEMS_PER_PAGE = 10;

export default function ClientWalksScreen() {
    const { user } = useAuth();
    const userId = user?.id;
    const router = useRouter();
    const { showSuccess, showError } = useToast();

    const [allTrips, setAllTrips] = useState([]);
    const [displayedTrips, setDisplayedTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    
    const [activeTab, setActiveTab] = useState("active");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);

    const [selectedStatus, setSelectedStatus] = useState(null);
    const [dateRange, setDateRange] = useState({ start: null, end: null });
    const [sortBy, setSortBy] = useState('date-desc');

    const [showCancelModal, setShowCancelModal] = useState(false);
    const [tripToCancel, setTripToCancel] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [tripToPay, setTripToPay] = useState(null);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [tripToReview, setTripToReview] = useState(null);
    const [reviewLoading, setReviewLoading] = useState(false);

    const [showViewReviewModal, setShowViewReviewModal] = useState(false);
    const [tripToViewReview, setTripToViewReview] = useState(null);
    const [currentReview, setCurrentReview] = useState(null);

    const loadTrips = useCallback(async () => {
        if (!userId) return;
        
        try {
            if (!refreshing) setLoading(true);
            setError(null);
            
            const tripsData = await WalksController.fetchWalksByOwner(userId);
            
            const tripsWithReviews = await Promise.all(
                tripsData.map(async (trip) => {
                    if (trip.status === 'Finalizado') {
                        try {
                            const review = await ReviewsController.fetchReviewByWalkId(trip.id);
                            const hasValidReview = review && 
                                                   typeof review === 'object' && 
                                                   !Array.isArray(review) && 
                                                   review.id;
                            return { 
                                ...trip, 
                                hasReview: hasValidReview, 
                                reviewId: hasValidReview ? review.id : null 
                            };
                        } catch (err) {
                            return { ...trip, hasReview: false, reviewId: null };
                        }
                    }
                    return trip;
                })
            );
            
            setAllTrips(tripsWithReviews);
            setCurrentPage(1);
            setHasMoreData(true);
        } catch (err) {
            setError('Error loading trips: ' + err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userId, refreshing]);

    useEffect(() => {
        loadTrips();
    }, [userId]);

    const applyFiltersAndSort = useCallback((trips) => {
        let filtered = [...trips];

        filtered = filtered.filter(trip => {
            if (activeTab === "active") {
                return ["Solicitado", "Esperando pago", "Agendado", "Activo"].includes(trip.status);
            } else {
                return ["Cancelado", "Rechazado", "Finalizado"].includes(trip.status);
            }
        });

        if (searchQuery) {
            filtered = filtered.filter(trip => 
                trip.dogName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                trip.walkerName?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedStatus) {
            filtered = filtered.filter(trip => trip.status === selectedStatus);
        }

        if (dateRange.start && dateRange.end) {
            filtered = filtered.filter(trip => {
                const tripDate = new Date(trip.startTime);
                return tripDate >= dateRange.start && tripDate <= dateRange.end;
            });
        }

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
    }, [activeTab, searchQuery, selectedStatus, dateRange, sortBy]);

    useEffect(() => {
        const filtered = applyFiltersAndSort(allTrips);
        const paginated = filtered.slice(0, currentPage * ITEMS_PER_PAGE);
        setDisplayedTrips(paginated);
        setHasMoreData(paginated.length < filtered.length);
    }, [allTrips, currentPage, applyFiltersAndSort]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, searchQuery, selectedStatus, dateRange, sortBy]);

    const onRefresh = () => {
        setRefreshing(true);
        setCurrentPage(1);
        loadTrips();
    };

    const loadMoreTrips = () => {
        if (!loadingMore && hasMoreData) {
            setLoadingMore(true);
            setTimeout(() => {
                setCurrentPage(prev => prev + 1);
                setLoadingMore(false);
            }, 500);
        }
    };

    const handleCancelTrip = (trip) => {
        setTripToCancel(trip);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        if (!tripToCancel) return;
        
        try {
            setCancelLoading(true);
            await WalksController.changeWalkStatus(tripToCancel.id, 'Cancelado');
            
            setAllTrips(trips => trips.map(trip => 
                trip.id === tripToCancel.id 
                    ? { ...trip, status: 'Cancelado' }
                    : trip
            ));
            
            setShowCancelModal(false);
            setTripToCancel(null);
        } catch (err) {
            setError('Error cancelling trip: ' + err.message);
            showError('No se pudo cancelar el paseo');
        } finally {
            setCancelLoading(false);
        }
    };

    const handleCloseCancelModal = () => {
        setShowCancelModal(false);
        setTripToCancel(null);
    };

    const handlePayTrip = (trip) => {
        setTripToPay(trip);
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = async () => {
        if (!tripToPay) return;
        
        try {
            setPaymentLoading(true);
            await WalksController.changeWalkStatus(tripToPay.id, 'Agendado');
            
            setAllTrips(trips => trips.map(trip => 
                trip.id === tripToPay.id 
                    ? { ...trip, status: 'Agendado' }
                    : trip
            ));
            
            setShowPaymentModal(false);
            setTripToPay(null);
        } catch (err) {
            setError('Error processing payment: ' + err.message);
            showError('No se pudo procesar el pago');
        } finally {
            setPaymentLoading(false);
        }
    };

    const handleClosePaymentModal = () => {
        setShowPaymentModal(false);
        setTripToPay(null);
    };

    const handleCreateReview = async (trip) => {
        try {
            const completeTrip = await WalksController.fetchWalkDetails(trip.id);
            setTripToReview(completeTrip);
            setShowReviewModal(true);
        } catch (err) {
            showError('No se pudo cargar la información del paseo');
        }
    };

    const handleSubmitReview = async (reviewData) => {
        if (!tripToReview) return;
        
        try {
            setReviewLoading(true);
            await ReviewsController.createReview({
                walkId: reviewData.id,
                walkerId: reviewData.walkerId,
                rating: reviewData.rating,
                content: reviewData.content
            });
            
            setAllTrips(trips => trips.map(trip => 
                trip.id === tripToReview.id 
                    ? { ...trip, hasReview: true }
                    : trip
            ));
            
            setShowReviewModal(false);
            setTripToReview(null);
            showSuccess('Reseña creada correctamente');
        } catch (err) {
            setError('Error creating review: ' + err.message);
            showError('No se pudo crear la reseña');
        } finally {
            setReviewLoading(false);
        }
    };

    const handleCloseReviewModal = () => {
        setShowReviewModal(false);
        setTripToReview(null);
    };

    const handleViewReview = async (trip) => {
        try {
            setTripToViewReview(trip);
            const review = await ReviewsController.fetchReviewByWalkId(trip.id);
            const hasValidReview = review && 
                                   typeof review === 'object' && 
                                   !Array.isArray(review) && 
                                   review.id;
            if (hasValidReview) {
                setCurrentReview(review);
                setShowViewReviewModal(true);
            } else {
                showError('No se encontró la reseña');
            }
        } catch (err) {
            setError('Error loading review: ' + err.message);
            showError('No se pudo cargar la reseña');
        }
    };

    const handleCloseViewReviewModal = () => {
        setShowViewReviewModal(false);
        setTripToViewReview(null);
        setCurrentReview(null);
    };

const handleViewTrip = (tripId) => {
    router.push({
        pathname: '/walkView',
        params: { tripId }
    });
};

    const activeTripsCount = allTrips.filter(trip => 
        ["Solicitado", "Esperando pago", "Agendado", "Activo"].includes(trip.status)
    ).length;

    const completedTripsCount = allTrips.filter(trip => 
        ["Cancelado", "Rechazado", "Finalizado"].includes(trip.status)
    ).length;

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🐕</Text>
            <Text style={styles.emptyTitle}>
                {searchQuery ? 'No se encontraron resultados' : 
                 activeTab === "active" ? "No tienes paseos activos" : "No hay paseos en el historial"}
            </Text>
            <Text style={styles.emptySubtitle}>
                {searchQuery ? 'Intenta con otra búsqueda' :
                 activeTab === "active" ? "¡Programa tu primer paseo!" : "Tus paseos completados aparecerán aquí"}
            </Text>
        </View>
    );

    const renderFooter = () => {
        if (!loadingMore) return null;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color="#3b82f6" />
                <Text style={styles.footerText}>Cargando más paseos...</Text>
            </View>
        );
    };

    if (loading) {
        return <LoadingScreen message="Cargando paseos..." />;
    }

    return (
        <View style={styles.container}>
            <MyTripsHeaderComponent 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                activeTripsCount={activeTripsCount}
                completedTripsCount={completedTripsCount}
                onRefresh={onRefresh}
                refreshing={refreshing}
            />

            <MyTripsFilter 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                sortBy={sortBy}
                setSortBy={setSortBy}
                activeTab={activeTab}
            />

            <FlatList
                data={displayedTrips}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <MyTripsCardComponent 
                        trip={item}
                        onViewTrip={handleViewTrip}
                        onCancelTrip={handleCancelTrip}
                        onPayTrip={handlePayTrip}
                        onCreateReview={handleCreateReview}
                        onViewReview={handleViewReview}
                    />
                )}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={renderEmptyState}
                ListFooterComponent={renderFooter}
                onEndReached={loadMoreTrips}
                onEndReachedThreshold={0.5}
                refreshing={refreshing}
                onRefresh={onRefresh}
            />

            <CancelWalkModal 
                visible={showCancelModal}
                onClose={handleCloseCancelModal}
                onConfirm={handleConfirmCancel}
                tripData={tripToCancel}
                isLoading={cancelLoading}
            />

            <PaymentModal 
                visible={showPaymentModal}
                onClose={handleClosePaymentModal}
                onConfirm={handleConfirmPayment}
                tripData={tripToPay}
                isLoading={paymentLoading}
            />

            <ReviewModal 
                visible={showReviewModal}
                onClose={handleCloseReviewModal}
                onSubmit={handleSubmitReview}
                tripData={tripToReview}
                isLoading={reviewLoading}
            />

            <ViewReviewModal 
                visible={showViewReviewModal}
                onClose={handleCloseViewReviewModal}
                reviewData={currentReview}
                tripData={tripToViewReview}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    listContainer: {
        padding: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    footerLoader: {
        paddingVertical: 20,
        alignItems: 'center',
        gap: 8,
    },
    footerText: {
        fontSize: 12,
        color: '#6b7280',
    },
});