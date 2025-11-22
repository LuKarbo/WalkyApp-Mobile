import { Feather } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { WalkMapController } from "../../backend/Controllers/WalkMapController";
import { useAuth } from "../../hooks/useAuth";

const WalkChat = ({ tripId, walkStatus }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sendingMessage, setSendingMessage] = useState(false);
    const [error, setError] = useState(null);

    const scrollViewRef = useRef(null);
    const { user } = useAuth();
    const userId = user?.id;
    const userName = user?.name || "Usuario";
    const userType = user?.type || "owner";

    const isChatVisible = WalkMapController.isChatVisible(walkStatus);
    const canSendMessages = WalkMapController.canSendMessages(walkStatus);
    const chatStatusMessage = WalkMapController.getChatStatusMessage(walkStatus);

    const isCurrentUserMessage = (message) => {
        return message.sender === userType;
    };

    useEffect(() => {
        let interval;
        if (tripId && userId && isChatVisible) {
            loadMessages();
            interval = setInterval(() => {
                loadMessages();
            }, 180000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [tripId, userId, isChatVisible]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const loadMessages = async () => {
        try {
            setLoading(true);
            setError(null);
            const chatMessages = await WalkMapController.getChatMessages(tripId);
            setMessages(chatMessages || []);

            if ((chatMessages || []).length > 0) {
                await WalkMapController.markMessagesAsRead(tripId, userId);
            }
        } catch (err) {
            setError("Error cargando mensajes: " + (err?.message || err));
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !tripId || !userId || !canSendMessages) return;

        try {
            setSendingMessage(true);
            setError(null);

            const sentMessage = await WalkMapController.sendMessage(
                tripId,
                userId,
                userType,
                userName,
                newMessage
            );

            setMessages((prev) => [...prev, sentMessage]);
            setNewMessage("");
            scrollToBottom();
        } catch (err) {
            setError("Error enviando mensaje: " + (err?.message || err));
        } finally {
            setSendingMessage(false);
        }
    };

    if (!isChatVisible) {
        return (
            <View style={styles.unavailableContainer}>
                <Feather name="message-circle" size={48} color="#9ca3af" />
                <Text style={styles.unavailableTitle}>Chat no disponible</Text>
                <Text style={styles.unavailableText}>{chatStatusMessage}</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={100}
        >
            <View style={styles.header}>
                <Feather name="message-circle" size={20} color="#10b981" />
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Chat del Paseo</Text>
                    <Text style={styles.statusText}>Estado: {chatStatusMessage}</Text>
                </View>
            </View>

            {error && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <ScrollView
                ref={scrollViewRef}
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            >
                {loading && messages.length === 0 ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#10b981" />
                        <Text style={styles.loadingText}>Cargando chat...</Text>
                    </View>
                ) : messages.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Feather name="message-circle" size={48} color="#9ca3af" />
                        <Text style={styles.emptyTitle}>No hay mensajes aún</Text>
                        <Text style={styles.emptyText}>
                            {walkStatus === "Finalizado"
                                ? "El paseo ha finalizado"
                                : "¡Inicia la conversación!"}
                        </Text>
                    </View>
                ) : (
                    messages.map((message, index) => {
                        const isCurrentUser = isCurrentUserMessage(message);
                        return (
                            <View
                                key={message.id || index}
                                style={[
                                    styles.messageWrapper,
                                    isCurrentUser
                                        ? styles.messageWrapperRight
                                        : styles.messageWrapperLeft,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.messageBubble,
                                        isCurrentUser
                                            ? styles.messageBubbleOwner
                                            : styles.messageBubbleWalker,
                                    ]}
                                >
                                    {!isCurrentUser && (
                                        <Text style={styles.senderName}>
                                            {message.senderName}
                                        </Text>
                                    )}
                                    <Text
                                        style={[
                                            styles.messageText,
                                            isCurrentUser
                                                ? styles.messageTextOwner
                                                : styles.messageTextWalker,
                                        ]}
                                    >
                                        {message.text}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.messageTime,
                                            isCurrentUser
                                                ? styles.messageTimeOwner
                                                : styles.messageTimeWalker,
                                        ]}
                                    >
                                        {message.time}
                                    </Text>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>

            <View
                style={[
                    styles.inputContainer,
                    !canSendMessages && styles.inputContainerDisabled,
                ]}
            >
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder={
                        walkStatus === "Finalizado"
                            ? "El paseo ha finalizado - No se pueden enviar mensajes"
                            : canSendMessages
                            ? "Escribe tu mensaje..."
                            : "Chat no disponible"
                    }
                    editable={!sendingMessage && canSendMessages}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        (!canSendMessages || !newMessage.trim() || sendingMessage) &&
                            styles.sendButtonDisabled,
                    ]}
                    onPress={sendMessage}
                    disabled={sendingMessage || !newMessage.trim() || !canSendMessages}
                >
                    {sendingMessage ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Feather name="send" size={16} color="#ffffff" />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
    },
    statusText: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 2,
    },
    errorBanner: {
        backgroundColor: "#fee2e2",
        padding: 8,
        borderLeftWidth: 4,
        borderLeftColor: "#ef4444",
    },
    errorText: {
        fontSize: 14,
        color: "#991b1b",
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: 12,
        flexGrow: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 24,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: "#6b7280",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 32,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#6b7280",
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: "#9ca3af",
        textAlign: "center",
    },
    messageWrapper: {
        marginBottom: 12,
        maxWidth: "75%",
    },
    messageWrapperRight: {
        alignSelf: "flex-end",
    },
    messageWrapperLeft: {
        alignSelf: "flex-start",
    },
    messageBubble: {
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    messageBubbleOwner: {
        backgroundColor: "#10b981",
        borderBottomRightRadius: 4,
    },
    messageBubbleWalker: {
        backgroundColor: "#111827",
        borderBottomLeftRadius: 4,
        borderWidth: 1,
        borderColor: "#374151",
    },
    senderName: {
        fontSize: 12,
        fontWeight: "600",
        color: "#9ca3af",
        marginBottom: 4,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    messageTextOwner: {
        color: "#111827",
    },
    messageTextWalker: {
        color: "#ffffff",
    },
    messageTime: {
        fontSize: 12,
        marginTop: 8,
        textAlign: "right",
    },
    messageTimeOwner: {
        color: "#065f46",
    },
    messageTimeWalker: {
        color: "#9ca3af",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
    },
    inputContainerDisabled: {
        opacity: 0.5,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#d1d5db",
        backgroundColor: "#f9fafb",
        fontSize: 14,
        color: "#111827",
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#10b981",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    unavailableContainer: {
        flex: 1,
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

export default WalkChat;