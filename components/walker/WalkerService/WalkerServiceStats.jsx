import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const WalkerServiceStats = ({ stats }) => {
    const statsConfig = [
        {
            title: "Totales",
            value: stats.total,
            icon: "walk",
            color: "#3b82f6"
        },
        {
            title: "Nuevos",
            value: stats.new,
            icon: "add-circle",
            color: "#10b981"
        },
        {
            title: "Esperando pago",
            value: stats.awaitingPayment,
            icon: "time",
            color: "#f59e0b"
        },
        {
            title: "Agendados",
            value: stats.scheduled,
            icon: "calendar",
            color: "#8b5cf6"
        },
        {
            title: "Activos",
            value: stats.active,
            icon: "play-circle",
            color: "#6366f1"
        },
        {
            title: "Finalizados",
            value: stats.completed,
            icon: "checkmark-circle",
            color: "#059669"
        },
        {
            title: "Rechazados y Cancelados",
            value: (stats.rejected + stats.canceled),
            icon: "close-circle",
            color: "#ef4444"
        }
    ];

    return (
        <View>
            <Text style={styles.header}>Resumen de Paseos</Text>
            <View style={styles.grid}>
                {statsConfig.map((stat, index) => (
                    <View key={index} style={[styles.statCard, { backgroundColor: stat.color }]}>
                        <View style={styles.iconWrapper}>
                            <Ionicons name={stat.icon} size={24} color="#ffffff" />
                        </View>
                        <Text style={styles.statTitle}>{stat.title}</Text>
                        <Text style={styles.statValue}>{stat.value}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        fontSize: 18,
        fontWeight: "600",
        color: "#1f2937",
        marginBottom: 16,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -6,
    },
    statCard: {
        width: "47%",
        margin: "1.5%",
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    statTitle: {
        fontSize: 11,
        color: "#ffffff",
        fontWeight: "500",
        textAlign: "center",
        marginBottom: 4,
    },
    statValue: {
        fontSize: 20,
        color: "#ffffff",
        fontWeight: "700",
    },
});

export default WalkerServiceStats;