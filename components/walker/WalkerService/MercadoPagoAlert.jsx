import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const MercadoPagoAlert = ({ onDismiss }) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.mainContent}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="warning" size={28} color="#f59e0b" />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>¡Atención! Sistema de cobro no configurado</Text>
                        <Text style={styles.description}>
                            Si no activas y configuras el sistema de cobro con Mercado Pago, los usuarios no podrán solicitar tu servicio de paseo de mascotas.
                        </Text>
                        <View style={styles.actionContainer}>
                            <Ionicons name="card" size={16} color="#f59e0b" />
                            <Text style={styles.actionText}>
                                Configura Mercado Pago desde la aplicación web
                            </Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#f59e0b" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: "#fffbeb",
        borderLeftWidth: 4,
        borderLeftColor: "#f59e0b",
        borderRadius: 12,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    content: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    mainContent: {
        flexDirection: "row",
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#fef3c7",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#78350f",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: "#92400e",
        lineHeight: 20,
        marginBottom: 12,
    },
    actionContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    actionText: {
        fontSize: 13,
        color: "#f59e0b",
        fontWeight: "600",
    },
    closeButton: {
        marginLeft: 8,
        padding: 4,
    },
});

export default MercadoPagoAlert;