import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const WalkerServiceHeader = ({ walkerData }) => {
    return (
        <View style={styles.container}>
            <View style={styles.overlay} />
            <View style={styles.content}>
                <View style={styles.mainContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="walk" size={40} color="#ffffff" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>Dashboard del Paseador</Text>
                        {walkerData && (
                            <Text style={styles.subtitle}>
                                Bienvenido, {walkerData.fullName}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={styles.rightContent}>
                    <Text style={styles.rightText}>Panel de Control</Text>
                    <Text style={styles.rightSubtext}>Gestiona tus servicios</Text>
                </View>
            </View>
            <View style={styles.circle1} />
            <View style={styles.circle2} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 16,
        borderRadius: 20,
        overflow: "hidden",
        position: "relative",
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#10b981",
        opacity: 0.95,
    },
    content: {
        padding: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
    },
    mainContent: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: "rgba(255, 255, 255, 0.9)",
        fontWeight: "500",
    },
    rightContent: {
        alignItems: "flex-end",
    },
    rightText: {
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.9)",
        fontWeight: "500",
    },
    rightSubtext: {
        fontSize: 10,
        color: "rgba(255, 255, 255, 0.7)",
    },
    circle1: {
        position: "absolute",
        top: -60,
        right: -60,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    circle2: {
        position: "absolute",
        bottom: -40,
        left: -40,
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
});

export default WalkerServiceHeader;