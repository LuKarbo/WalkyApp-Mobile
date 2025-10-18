import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { WalksController } from "../../backend/Controllers/WalksController";
import WalkChat from "../../components/walk/WalkChat";
import WalkData from "../../components/walk/WalkData";
import WalkMap from "../../components/walk/WalkMap";

const WalkView = () => {
    
    const { tripId } = useLocalSearchParams();
    const [walkData, setWalkData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadWalkData();
    }, [tripId]);

    const loadWalkData = async () => {
        if (!tripId) {
            setLoading(false);
            return;
        }

        try {
            setError(null);
            const data = await WalksController.fetchWalkDetails(tripId);
            setWalkData(data);
        } catch (err) {
            setError('Error cargando datos del paseo: ' + err.message);
            
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10b981" />
                <Text style={styles.loadingText}>Cargando datos del paseo...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorIcon}>⚠️</Text>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
                <View style={styles.mapSection}>
                    {walkData ? (
                        <WalkMap tripId={tripId} walkStatus={walkData?.status} />
                    ) : (
                        <View style={{ height: 400, justifyContent: "center", alignItems: "center" }}>
                            <ActivityIndicator size="large" color="#10b981" />
                        </View>
                    )}
                </View>

                <View style={styles.dataSection}>
                    <WalkData 
                        tripId={tripId} 
                        walkStatus={walkData?.status} 
                    />
                </View>

                <View style={styles.chatSection}>
                    <WalkChat 
                        tripId={tripId} 
                        walkStatus={walkData?.status} 
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },
    content: {
        padding: 16,
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
    errorIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 16,
        color: "#dc2626",
        textAlign: "center",
    },
    mapSection: {
        marginBottom: 16,
    },
    dataSection: {
        marginBottom: 16,
    },
    chatSection: {
        height: 500,
        marginBottom: 16,
    },
});

export default WalkView;