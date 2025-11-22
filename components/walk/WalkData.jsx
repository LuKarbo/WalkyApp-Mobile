import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { WalkMapController } from "../../backend/Controllers/WalkMapController";

const WalkData = ({ tripId, walkStatus }) => {
    const [apiRecords, setApiRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isTrackingVisible = WalkMapController.isTrackingVisible(walkStatus);
    const trackingStatusMessage = WalkMapController.getTrackingStatusMessage(walkStatus);

    useEffect(() => {
        if (tripId && isTrackingVisible) {
            loadWalkRecords();
        }
    }, [tripId, isTrackingVisible]);

    const loadWalkRecords = async () => {
        try {
            setLoading(true);
            setError(null);

            const fetchedRecords = await WalkMapController.getWalkRecords(tripId);
            
            const recordsWithAddresses = await Promise.all(
                fetchedRecords.map(async (record) => {
                    
                    const hasRealAddress = record.address && 
                                        !record.address.startsWith('Lat:') &&
                                        record.address !== '';
                    
                    if (hasRealAddress) {
                        return record;
                    }
                    
                    try {
                        const address = await reverseGeocode(
                            parseFloat(record.lat),
                            parseFloat(record.lng)
                        );
                        return { ...record, address };
                    } catch (err) {
                        return { 
                            ...record, 
                            address: `${record.lat}, ${record.lng}` 
                        };
                    }
                })
            );
            
            setApiRecords(recordsWithAddresses);
        } catch (err) {
            setError("Error cargando registros: " + err.message);
            
        } finally {
            setLoading(false);
        }
    };

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            
            if (data.status === 'OK' && data.results.length > 0) {
                
                const streetAddress = data.results.find(
                    result => result.types.includes('street_address') ||
                              result.types.includes('route')
                );
                
                if (streetAddress) {
                    return streetAddress.formatted_address;
                }
                
                return data.results[0].formatted_address;
            }
            
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        } catch (error) {
            
            return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
    };

    const sortedRecords = apiRecords.sort(
        (a, b) => new Date(b.timeFull) - new Date(a.timeFull)
    );

    if (!isTrackingVisible) {
        return (
            <View style={styles.unavailableContainer}>
                <Feather name="activity" size={48} color="#9ca3af" />
                <Text style={styles.unavailableTitle}>
                    Seguimiento no disponible
                </Text>
                <Text style={styles.unavailableText}>
                    {trackingStatusMessage}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Feather name="activity" size={20} color="#10b981" />
                <Text style={styles.headerTitle}>Seguimiento del paseo</Text>
            </View>

            <Text style={styles.statusMessage}>{trackingStatusMessage}</Text>

            {error && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {loading && (
                <View style={styles.loadingBanner}>
                    <ActivityIndicator size="small" color="#3b82f6" />
                    <Text style={styles.loadingText}>Cargando registros...</Text>
                </View>
            )}

            {sortedRecords.length === 0 ? (
                <View style={styles.emptyState}>
                    <Feather name="map-pin" size={32} color="#9ca3af" />
                    <Text style={styles.emptyTitle}>No hay registros todavía</Text>
                    <Text style={styles.emptyText}>
                        {walkStatus?.toLowerCase() === "activo"
                            ? "Esperando registros de seguimiento..."
                            : walkStatus?.toLowerCase() === "finalizado"
                            ? "Este paseo no tuvo puntos de seguimiento"
                            : "Los registros aparecerán cuando el paseo esté activo"}
                    </Text>
                </View>
            ) : (
                <ScrollView style={styles.recordsList} showsVerticalScrollIndicator={false}>
                    {sortedRecords.map((record, index) => (
                        <View
                            key={record.id || index}
                            style={[
                                styles.recordItem,
                                walkStatus?.toLowerCase() === "finalizado" &&
                                    styles.recordItemCompleted,
                            ]}
                        >
                            <Feather
                                name="map-pin"
                                size={14}
                                color="#10b981"
                                style={styles.recordIcon}
                            />
                            <View style={styles.recordContent}>
                                <Text style={styles.recordTime}>{record.time}</Text>
                                <Text style={styles.recordAddress}>
                                    {record.address}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            {walkStatus?.toLowerCase() === "finalizado" &&
                sortedRecords.length > 0 && (
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Paseo completado - {sortedRecords.length} punto
                            {sortedRecords.length !== 1 ? "s" : ""} registrado
                            {sortedRecords.length !== 1 ? "s" : ""}
                        </Text>
                    </View>
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#111827",
    },
    statusMessage: {
        fontSize: 12,
        color: "#6b7280",
        marginBottom: 12,
    },
    errorBanner: {
        backgroundColor: "#fee2e2",
        padding: 8,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#ef4444",
        marginBottom: 12,
    },
    errorText: {
        fontSize: 14,
        color: "#991b1b",
    },
    loadingBanner: {
        backgroundColor: "#dbeafe",
        padding: 8,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    loadingText: {
        fontSize: 14,
        color: "#1e40af",
    },
    emptyState: {
        alignItems: "center",
        paddingVertical: 24,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6b7280",
        marginTop: 8,
        marginBottom: 4,
    },
    emptyText: {
        fontSize: 14,
        color: "#9ca3af",
        textAlign: "center",
    },
    recordsList: {
        maxHeight: 240,
    },
    recordItem: {
        flexDirection: "row",
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        marginBottom: 8,
    },
    recordItemCompleted: {
        opacity: 0.75,
    },
    recordIcon: {
        marginTop: 4,
        marginRight: 8,
    },
    recordContent: {
        flex: 1,
    },
    recordTime: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",
        marginBottom: 2,
    },
    recordAddress: {
        fontSize: 14,
        color: "#1f2937",
        lineHeight: 20,
    },
    footer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
    },
    footerText: {
        fontSize: 12,
        color: "#6b7280",
        textAlign: "center",
    },
    unavailableContainer: {
        backgroundColor: "#f3f4f6",
        borderRadius: 16,
        padding: 32,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#d1d5db",
    },
    unavailableTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#6b7280",
        marginTop: 16,
        marginBottom: 8,
    },
    unavailableText: {
        fontSize: 14,
        color: "#9ca3af",
        textAlign: "center",
    },
});

export default WalkData;