import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

import { useToast } from '../../backend/Context/ToastContext';
import { WalkerController } from "../../backend/Controllers/WalkerController";
import { WalksController } from "../../backend/Controllers/WalksController";
import { useAuth } from "../../hooks/useAuth";

import MercadoPagoAlert from "../../components/walker/WalkerService/MercadoPagoAlert";
import WalkerServiceChart from "../../components/walker/WalkerService/WalkerServiceChart";
import WalkerServiceEarnings from "../../components/walker/WalkerService/WalkerServiceEarnings";
import WalkerServiceHeader from "../../components/walker/WalkerService/WalkerServiceHeader";
import WalkerServiceSettings from "../../components/walker/WalkerService/WalkerServiceSettings";
import WalkerServiceStats from "../../components/walker/WalkerService/WalkerServiceStats";

const WalkerServiceScreen = () => {
    const { user } = useAuth();
    const { showError, showSuccess } = useToast();
    const walkerId = user?.id;

    const [walkerData, setWalkerData] = useState(null);
    const [walksData, setWalksData] = useState([]);
    const [earnings, setEarnings] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [settings, setSettings] = useState({
        location: "",
        pricePerPet: 0,
        hasDiscount: false,
        discountPercentage: 0,
        hasMercadoPago: false,
        tokenMercadoPago: ""
    });

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showMercadoPagoAlert, setShowMercadoPagoAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const loadWalkerData = async () => {
        if (!walkerId) return;

        try {
            setLoading(true);
            setError(null);

            const [walker, walks, walkerSettings, calculatedEarnings] = await Promise.all([
                WalkerController.fetchWalkerProfile(walkerId),
                WalksController.fetchWalksByWalker(walkerId),
                WalkerController.fetchWalkerSettings(walkerId),
                WalkerController.getWalkerEarnings(walkerId)
            ]);

            setWalkerData(walker);
            setWalksData(walks);
            setSettings(walkerSettings);

            const calculatedChartData = generateChartData(walks);

            setEarnings(calculatedEarnings);
            setChartData(calculatedChartData);

            const isMercadoPagoConfigured = walkerSettings.hasMercadoPago &&
                walkerSettings.tokenMercadoPago;
            setShowMercadoPagoAlert(!isMercadoPagoConfigured);

        } catch (err) {
            showError("Error al cargar la información del paseador.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWalkerData();
    }, [walkerId]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadWalkerData();
        setRefreshing(false);
    }, [walkerId]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage("");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const generateChartData = (walks) => {
        const last7Days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            last7Days.push(date);
        }

        const chartData = last7Days.map(date => {
            const dayWalks = walks.filter(walk => {
                const walkDate = new Date(walk.startTime);
                return walkDate.toDateString() === date.toDateString() &&
                    walk.status === 'Finalizado';
            });

            return {
                day: date.toLocaleDateString('es-ES', { weekday: 'short' }),
                walks: dayWalks.length,
                date: date
            };
        });

        return chartData;
    };

    const getWalksStats = () => {
        const stats = {
            total: walksData.length,
            new: walksData.filter(w => w.status === 'Solicitado').length,
            awaitingPayment: walksData.filter(w => w.status === 'Esperando pago').length,
            scheduled: walksData.filter(w => w.status === 'Agendado').length,
            active: walksData.filter(w => w.status === 'Activo').length,
            completed: walksData.filter(w => w.status === 'Finalizado').length,
            rejected: walksData.filter(w => w.status === 'Rechazado').length
        };

        return stats;
    };

    const handleSettingsChange = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const handleSaveSettings = async () => {
        try {
            setSaving(true);
            setError(null);

            // Asegurar que pricePerPet sea un número válido mayor a 0
            const priceValue = parseFloat(settings.pricePerPet);
            if (isNaN(priceValue) || priceValue <= 0) {
                setError('El precio por mascota debe ser mayor a 0');
                setSaving(false);
                return;
            }

            const discountValue = parseFloat(settings.discountPercentage) || 0;

            const settingsToUpdate = {
                location: settings.location ? settings.location.trim() : '',
                pricePerPet: priceValue,
                hasDiscount: settings.hasDiscount === true,
                discountPercentage: discountValue
            };

            const updatedSettings = await WalkerController.updateWalkerSettings(walkerId, settingsToUpdate);

            setSettings(prev => ({
                ...prev,
                ...updatedSettings
            }));

            showSuccess('Configuración guardada exitosamente');
        } catch (err) {
            showError('Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    const handleDismissAlert = () => {
        setShowMercadoPagoAlert(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10b981" />
                <Text style={styles.loadingText}>Cargando dashboard del paseador...</Text>
            </View>
        );
    }

    if (error && !walkerData) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    const walksStats = getWalksStats();

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {successMessage && (
                    <View style={styles.successContainer}>
                        <Text style={styles.successText}>✓ {successMessage}</Text>
                    </View>
                )}

                {error && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorBannerText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError(null)}>
                            <Text style={styles.errorDismiss}>✕</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {showMercadoPagoAlert && (
                    <MercadoPagoAlert onDismiss={handleDismissAlert} />
                )}

                <WalkerServiceHeader walkerData={walkerData} />

                <View style={styles.card}>
                    <WalkerServiceStats stats={walksStats} />
                </View>

                <View style={styles.gridContainer}>
                    <View style={styles.gridItem}>
                        <WalkerServiceEarnings earnings={earnings} />
                    </View>

                    <View style={styles.gridItem}>
                        <WalkerServiceChart chartData={chartData} />
                    </View>
                </View>

                <View style={styles.card}>
                    <WalkerServiceSettings
                        settings={settings}
                        onSettingsChange={handleSettingsChange}
                        onSave={handleSaveSettings}
                        isSaving={saving}
                    />
                </View>
            </ScrollView>
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
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9fafb",
        padding: 24,
    },
    errorText: {
        fontSize: 16,
        color: "#dc2626",
        textAlign: "center",
    },
    successContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: "#d1fae5",
        borderLeftWidth: 4,
        borderLeftColor: "#10b981",
        borderRadius: 12,
        padding: 16,
    },
    successText: {
        fontSize: 14,
        color: "#065f46",
        fontWeight: "600",
    },
    errorBanner: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: "#fee2e2",
        borderLeftWidth: 4,
        borderLeftColor: "#ef4444",
        borderRadius: 12,
        padding: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    errorBannerText: {
        flex: 1,
        fontSize: 14,
        color: "#991b1b",
        fontWeight: "600",
    },
    errorDismiss: {
        fontSize: 20,
        color: "#ef4444",
        marginLeft: 12,
    },
    card: {
        marginHorizontal: 16,
        marginBottom: 16,
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    gridContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    gridItem: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
});

export default WalkerServiceScreen;