import { Ionicons } from "@expo/vector-icons";
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const FinishWalkModal = ({ isOpen, onClose, onConfirm, walkData, isLoading }) => {
    if (!isOpen || !walkData) return null;

    return (
        <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
        >
        <View style={styles.overlay}>
            <View style={styles.modalContainer}>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                disabled={isLoading}
            >
                <Ionicons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={styles.iconContainer}>
                <Ionicons name="checkmark-circle" size={64} color="#ef4444" />
                </View>

                <Text style={styles.title}>Finalizar Paseo</Text>

                <Text style={styles.message}>
                ¿Estás seguro de que querés marcar el paseo de{" "}
                <Text style={styles.dogName}>{walkData.dogName}</Text> como
                finalizado?
                </Text>

                <View style={styles.actions}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onClose}
                    disabled={isLoading}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={onConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? (
                    <>
                        <ActivityIndicator size="small" color="#ffffff" />
                        <Text style={styles.confirmButtonText}>Finalizando...</Text>
                    </>
                    ) : (
                    <Text style={styles.confirmButtonText}>Finalizar</Text>
                    )}
                </TouchableOpacity>
                </View>
            </View>
            </View>
        </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    modalContainer: {
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 24,
        width: "100%",
        maxWidth: 400,
    },
    closeButton: {
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#f3f4f6",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        alignItems: "center",
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 16,
        textAlign: "center",
    },
    message: {
        fontSize: 16,
        color: "#6b7280",
        textAlign: "center",
        marginBottom: 24,
        lineHeight: 24,
    },
    dogName: {
        fontWeight: "600",
        color: "#1f2937",
    },
    actions: {
        flexDirection: "row",
        gap: 12,
        width: "100%",
    },
    button: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    cancelButton: {
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#d1d5db",
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#6b7280",
    },
    confirmButton: {
        backgroundColor: "#ef4444",
    },
    confirmButtonText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#ffffff",
    },
});

export default FinishWalkModal;