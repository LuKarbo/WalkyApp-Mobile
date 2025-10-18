import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { WalkMapController } from "../../backend/Controllers/WalkMapController";

const WalkMap = ({ tripId, walkStatus }) => {
    const [path, setPath] = useState([]);
    const [routePath, setRoutePath] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapReady, setMapReady] = useState(false);
    const [shouldRenderMap, setShouldRenderMap] = useState(false);
    const [routeCalculated, setRouteCalculated] = useState(false);
    const [hasNoData, setHasNoData] = useState(false);
    const [dataChecked, setDataChecked] = useState(false);
    const mapRef = useRef(null);

    const isMapVisible = true;
    const mapStatusMessage = WalkMapController.getMapStatusMessage(walkStatus);

    // Región dinámica basada en si hay datos
    const getInitialRegion = () => {
        if (path.length > 0) {
            return {
                latitude: path[0].latitude,
                longitude: path[0].longitude,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            };
        }
        return {
            latitude: -34.6037,
            longitude: -58.3816,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
        };
    };

    useEffect(() => {
        return () => resetMapState();
    }, []);

    useEffect(() => resetMapState(), [tripId]);

    const resetMapState = () => {
        setPath([]);
        setRoutePath([]);
        setLoading(false);
        setError(null);
        setMapReady(false);
        setShouldRenderMap(false);
        setRouteCalculated(false);
        setHasNoData(false);
        setDataChecked(false);
    };

    useEffect(() => {
        if (tripId) {
            const timer = setTimeout(() => setShouldRenderMap(true), 100);
            return () => clearTimeout(timer);
        }
    }, [tripId]);

    useEffect(() => {
        if (mapReady && tripId && isMapVisible) loadWalkRoute();
    }, [mapReady, tripId, isMapVisible]);

    useEffect(() => {
        if (path.length > 0 && !routeCalculated) {
            setHasNoData(false);
            if (path.length >= 2) calculateRoute(path);
            else {
                setRoutePath(path);
                setRouteCalculated(true);
            }
        }
    }, [path, routeCalculated]);

    useEffect(() => {
        if (routeCalculated && routePath.length > 0 && mapRef.current) {
            const timer = setTimeout(() => fitMapToRoute(), 800);
            return () => clearTimeout(timer);
        }
    }, [routeCalculated, routePath]);

    const fitMapToRoute = () => {
        if (!mapRef.current || routePath.length === 0) return;
        if (routePath.length === 1) {
            mapRef.current.animateToRegion(
                {
                    latitude: routePath[0].latitude,
                    longitude: routePath[0].longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                },
                800
            );
        } else {
            mapRef.current.fitToCoordinates(routePath, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    };

    const loadWalkRoute = async () => {
        if (loading) return;
        try {
            setLoading(true);
            setError(null);
            setRouteCalculated(false);
            setHasNoData(false);
            setDataChecked(false);
            
            const route = await WalkMapController.getWalkRoute(tripId);
            
            console.log("📊 Datos recibidos:", route ? route.length : 0, "puntos");
            
            if (!route || route.length === 0) {
                console.log("⚠️ No hay datos de ruta disponibles");
                setPath([]);
                setRoutePath([]);
                setHasNoData(true);
                setRouteCalculated(true);
                setDataChecked(true);
                return;
            }
            
            const normalizedPath = route.map((point) => ({
                latitude: parseFloat(point.lat),
                longitude: parseFloat(point.lng),
            }));
            
            console.log("✅ Path normalizado:", normalizedPath.length, "puntos");
            setPath(normalizedPath);
            setDataChecked(true);
        } catch (err) {
            console.error("❌ Error cargando ruta:", err);
            setError("Error cargando ruta: " + err.message);
            setHasNoData(true);
            setRouteCalculated(true);
            setDataChecked(true);
        } finally {
            setLoading(false);
        }
    };

    const calculateRoute = async (points) => {
        try {
            if (points.length < 2) {
                setRoutePath(points);
                setRouteCalculated(true);
                return;
            }
            const origin = `${points[0].latitude},${points[0].longitude}`;
            const destination = `${points[points.length - 1].latitude},${points[points.length - 1].longitude}`;
            const waypoints = points
                .slice(1, -1)
                .slice(0, 23)
                .map((p) => `${p.latitude},${p.longitude}`)
                .join("|");
            const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
            const waypointsParam = waypoints ? `&waypoints=${waypoints}` : "";
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}${waypointsParam}&mode=walking&key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === "OK" && data.routes.length > 0) {
                const encodedPolyline = data.routes[0].overview_polyline.points;
                setRoutePath(decodePolyline(encodedPolyline));
            } else setRoutePath(points);
        } catch {
            setRoutePath(points);
        } finally {
            setRouteCalculated(true);
        }
    };

    const decodePolyline = (encoded) => {
        const poly = [];
        let index = 0, lat = 0, lng = 0;
        while (index < encoded.length) {
            let b, shift = 0, result = 0;
            do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
            const dlat = (result & 1) ? ~(result >> 1) : result >> 1;
            lat += dlat;
            shift = 0; result = 0;
            do { b = encoded.charCodeAt(index++) - 63; result |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
            const dlng = (result & 1) ? ~(result >> 1) : result >> 1;
            lng += dlng;
            poly.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
        }
        return poly;
    };

    const handleMapReady = () => {
        console.log("✅ Mapa listo");
        setMapReady(true);
    };

    const handleRefreshMap = () => {
        console.log("🔄 Refrescando mapa...");
        resetMapState();
        setTimeout(() => setShouldRenderMap(true), 100);
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
                <Text style={styles.statusText}>
                    {mapStatusMessage}
                    {path.length > 0 && ` - ${path.length} puntos`}
                </Text>
                <TouchableOpacity onPress={handleRefreshMap} style={styles.refreshButton} disabled={loading}>
                    <Feather name="refresh-cw" size={16} color={loading ? "#9ca3af" : "#10b981"} />
                </TouchableOpacity>
            </View>

            {error && <View style={styles.errorBanner}><Text style={styles.errorText}>{error}</Text></View>}

            {loading && (
                <View style={styles.loadingBanner}>
                    <ActivityIndicator size="small" color="#3b82f6" />
                    <Text style={styles.loadingText}>Cargando puntos...</Text>
                </View>
            )}

            <View style={styles.mapContainer}>
                {!mapReady && shouldRenderMap && (
                    <View style={styles.mapLoadingOverlay}>
                        <ActivityIndicator size="large" color="#10b981" />
                        <Text style={styles.mapLoadingText}>Iniciando mapa...</Text>
                    </View>
                )}
                
                {shouldRenderMap && (
                    <MapView
                        key={`map-${tripId}-${routeCalculated}`}
                        ref={mapRef}
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={getInitialRegion()}
                        scrollEnabled
                        zoomEnabled
                        pitchEnabled
                        rotateEnabled
                        onMapReady={handleMapReady}
                        loadingEnabled
                        loadingIndicatorColor="#10b981"
                        loadingBackgroundColor="#f9fafb"
                        mapType="standard"
                        showsCompass
                        showsScale
                        toolbarEnabled={false}
                        zoomControlEnabled={true}
                    >
                        {mapReady && routeCalculated && routePath.length > 0 && (
                            <>
                                {routePath.length >= 2 && (
                                    <Polyline
                                        key={`polyline-${tripId}`}
                                        coordinates={routePath}
                                        strokeColor={
                                            walkStatus?.toLowerCase() === "finalizado"
                                                ? "#94a3b8"
                                                : "#10b981"
                                        }
                                        strokeWidth={5}
                                        lineCap="round"
                                        lineJoin="round"
                                    />
                                )}
                                {path.map((point, index) => {
                                    const isFirst = index === 0;
                                    const isLast = index === path.length - 1;
                                    const letter = String.fromCharCode(65 + index);
                                    return (
                                        <Marker
                                            key={`marker-${tripId}-${index}`}
                                            coordinate={point}
                                            tracksViewChanges
                                        >
                                            <View
                                                style={[
                                                    styles.markerContainer,
                                                    isFirst && styles.markerStart,
                                                    isLast &&
                                                        walkStatus?.toLowerCase() ===
                                                            "finalizado" &&
                                                        styles.markerEnd,
                                                ]}
                                            >
                                                <Text style={styles.markerText}>{letter}</Text>
                                            </View>
                                        </Marker>
                                    );
                                })}
                            </>
                        )}
                    </MapView>
                )}
                
                {/* Mensaje cuando no hay datos - SOLO SI YA SE VERIFICARON LOS DATOS */}
                {mapReady && hasNoData && dataChecked && !loading && (
                    <View style={styles.noDataOverlay}>
                        <Feather name="map" size={48} color="#9ca3af" />
                        <Text style={styles.noDataText}>Sin datos de ruta</Text>
                        <Text style={styles.noDataSubtext}>
                            No hay puntos registrados para este paseo
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: "#ffffff", borderRadius: 16, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
    header: { flexDirection: "row", alignItems: "center", padding: 12, gap: 8, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" },
    statusText: { flex: 1, fontSize: 12, color: "#6b7280" },
    refreshButton: { padding: 8, borderRadius: 8, backgroundColor: "#f3f4f6" },
    errorBanner: { backgroundColor: "#fee2e2", padding: 12, borderLeftWidth: 4, borderLeftColor: "#ef4444" },
    errorText: { fontSize: 14, color: "#991b1b" },
    loadingBanner: { backgroundColor: "#dbeafe", padding: 12, flexDirection: "row", alignItems: "center", gap: 8 },
    loadingText: { fontSize: 14, color: "#1e40af" },
    mapContainer: { height: 400, position: "relative" },
    map: { flex: 1 },
    mapLoadingOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#f9fafb", justifyContent: "center", alignItems: "center", zIndex: 10, gap: 16 },
    mapLoadingText: { fontSize: 16, color: "#6b7280", fontWeight: "500", marginTop: 8 },
    noDataOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(249, 250, 251, 0.95)", justifyContent: "center", alignItems: "center", zIndex: 5, gap: 12 },
    noDataText: { fontSize: 18, fontWeight: "600", color: "#6b7280" },
    noDataSubtext: { fontSize: 14, color: "#9ca3af", textAlign: "center", paddingHorizontal: 32 },
    markerContainer: { backgroundColor: "#af051bff", borderRadius: 20, width: 32, height: 32, justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "#ffffff", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
    markerStart: { backgroundColor: "#015036ff" },
    markerEnd: { backgroundColor: "#ef4444" },
    markerText: { color: "#ffffff", fontSize: 14, fontWeight: "bold" },
    noDataContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 40, backgroundColor: "#f9fafb" },
    unavailableContainer: { backgroundColor: "#f3f4f6", borderRadius: 16, padding: 48, alignItems: "center", justifyContent: "center", height: 400, borderWidth: 1, borderColor: "#d1d5db" },
    unavailableTitle: { fontSize: 18, fontWeight: "600", color: "#6b7280", marginTop: 16, marginBottom: 8 },
    unavailableText: { fontSize: 14, color: "#9ca3af", textAlign: "center" },
});

export default WalkMap;