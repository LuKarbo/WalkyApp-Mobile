import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const WalkerWalksHeader = ({
    activeTab,
    setActiveTab,
    requestsCount,
    activeCount,
    historyCount,
}) => {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Mis Servicios de Paseo</Text>

        <View style={styles.tabsContainer}>
            <TouchableOpacity
            style={[
                styles.tab,
                activeTab === "requests" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("requests")}
            >
            <Text
                style={[
                styles.tabText,
                activeTab === "requests" && styles.tabTextActive,
                ]}
            >
                Solicitudes ({requestsCount})
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[
                styles.tab,
                activeTab === "active" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("active")}
            >
            <Text
                style={[
                styles.tabText,
                activeTab === "active" && styles.tabTextActive,
                ]}
            >
                Activos ({activeCount})
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
            style={[
                styles.tab,
                activeTab === "history" && styles.tabActive,
            ]}
            onPress={() => setActiveTab("history")}
            >
            <Text
                style={[
                styles.tabText,
                activeTab === "history" && styles.tabTextActive,
                ]}
            >
                Historial ({historyCount})
            </Text>
            </TouchableOpacity>
        </View>
        </View>
    );
    };

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#10b981",
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: 20,
    },
    tabsContainer: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
    },
    tabActive: {
        backgroundColor: "#ffffff",
    },
    tabText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#ffffff",
    },
    tabTextActive: {
        color: "#10b981",
    },
    subtitle: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.8)",
        textAlign: "right",
        fontWeight: "500",
    },
});

export default WalkerWalksHeader;