import { Feather } from "@expo/vector-icons";
import { DirectionsRenderer, DirectionsService, GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { WalkMapController } from "../../backend/Controllers/WalkMapController";

const defaultRegion = {
    lat: -34.6037,
    lng: -58.3816,
};

const containerStyle = {
    width: "100%",
    height: "400px",
};

const WalkMap = ({ tripId, walkStatus }) => {
    const [path, setPath] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [directions, setDirections] = useState(null);

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
                lat: parseFloat(point.lat),
                lng: parseFloat(point.lng)
            }));
            
            setPath(normalizedPath);

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

    const center = path.length > 0 
        ? { lat: path[0].lat, lng: path[0].lng }
        : defaultRegion;

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
                <LoadScript googleMapsApiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={13}
                        options={{
                            disableDefaultUI: false,
                            zoomControl: true,
                            mapTypeControl: false,
                            streetViewControl: false,
                            fullscreenControl: true,
                            gestureHandling: 'greedy'
                        }}
                    >
                        {path.length >= 2 && !directions && (
                            <DirectionsService
                                options={{
                                    origin: path[0],
                                    destination: path[path.length - 1],
                                    waypoints: path.slice(1, -1).map((p) => ({
                                        location: p,
                                        stopover: true,
                                    })),
                                    travelMode: "WALKING",
                                }}
                                callback={(res) => {
                                    if (res !== null && res.status === "OK") {
                                        setDirections(res);
                                    }
                                }}
                            />
                        )}

                        {directions && (
                            <DirectionsRenderer
                                options={{
                                    directions: directions,
                                    polylineOptions: {
                                        strokeColor: walkStatus?.toLowerCase() === 'finalizado' ? "#94a3b8" : "#4ade80",
                                        strokeOpacity: walkStatus?.toLowerCase() === 'finalizado' ? 0.7 : 1,
                                        strokeWeight: 5,
                                    },
                                }}
                            />
                        )}

                        {path.length === 1 && (
                            <Marker
                                position={path[0]}
                                icon="http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                            />
                        )}

                        {path.length > 1 && walkStatus?.toLowerCase() === 'finalizado' && (
                            <Marker
                                position={path[path.length - 1]}
                                icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                            />
                        )}
                    </GoogleMap>
                </LoadScript>
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