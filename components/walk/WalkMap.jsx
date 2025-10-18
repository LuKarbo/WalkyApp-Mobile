import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { WalkMapController } from "../../backend/Controllers/WalkMapController";

const defaultRegion = {
    latitude: -34.6037,
    longitude: -58.3816,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const WalkMap = ({ tripId, walkStatus }) => {
    const [path, setPath] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [region, setRegion] = useState(defaultRegion);

    const isMapVisible = WalkMapController.isMapVisible(walkStatus);
    const mapStatusMessage = WalkMapController.getMapStatusMessage(walkStatus);

    useEffect(() => {
        if (tripId && isMapVisible) {
            loadWalkRoute();
        } else {
            setPath([]);
        }
    }, [tripId, isMapVisible]);

    const loadWalkRoute = async () => {
        try {
            setLoading(true);
            setError(null);

            const route = await WalkMapController.getWalkRoute(tripId);
            
            const normalizedPath = route.map(point => ({
                latitude: parseFloat(point.lat),
                longitude: parseFloat(point.lng)
            }));
            
            setPath(normalizedPath);

            if (normalizedPath.length > 0) {
                setRegion({
                    latitude: normalizedPath[0].latitude,
                    longitude: normalizedPath[0].longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            }
        } catch (err) {
            setError("Error cargando ruta: " + err.message);
            
        } finally {
            setLoading(false);
        }
    };

    if (!isMapVisible) {
        return (
            <View style={styles.unavailableContainer}>
                <Feather name="map" size={48} color="#9ca3af" />
                <Text style={styles.unavailableTitle}>Mapa no disponible</Text>
                <Text style={styles.unavailableText}>{mapStatusMessage}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Feather name="map-pin" size={16} color="#10b981" />
                <Text style={styles.statusText}>{mapStatusMessage}</Text>
            </View>

            {error && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {loading && (
                <View style={styles.loadingBanner}>
                    <ActivityIndicator size="small" color="#3b82f6" />
                    <Text style={styles.loadingText}>Cargando mapa...</Text>
                </View>
            )}

            <View style={styles.mapContainer}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={region}
                    scrollEnabled={true}
                    zoomEnabled={true}
                    pitchEnabled={true}
                    rotateEnabled={true}
                >
                    {path.length >= 2 && (
                        <Polyline
                            coordinates={path}
                            strokeColor={
                                walkStatus?.toLowerCase() === "finalizado"
                                    ? "#94a3b8"
                                    : "#4ade80"
                            }
                            strokeWidth={5}
                        />
                    )}

                    {path.length === 1 && (
                        <Marker
                            coordinate={path[0]}
                            pinColor="green"
                            title="Inicio"
                        />
                    )}

                    {path.length > 1 &&
                        walkStatus?.toLowerCase() === "finalizado" && (
                            <Marker
                                coordinate={path[path.length - 1]}
                                pinColor="red"
                                title="Fin"
                            />
                        )}
                </MapView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
    },
    statusText: {
        fontSize: 14,
        color: "#6b7280",
    },
    errorBanner: {
        backgroundColor: "#fee2e2",
        padding: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#ef4444",
    },
    errorText: {
        fontSize: 14,
        color: "#991b1b",
    },
    loadingBanner: {
        backgroundColor: "#dbeafe",
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    loadingText: {
        fontSize: 14,
        color: "#1e40af",
    },
    mapContainer: {
        height: 400,
    },
    map: {
        flex: 1,
    },
    unavailableContainer: {
        backgroundColor: "#f3f4f6",
        borderRadius: 16,
        padding: 48,
        alignItems: "center",
        justifyContent: "center",
        height: 400,
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

export default WalkMap;