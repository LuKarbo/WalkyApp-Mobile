import { Feather } from '@expo/vector-icons';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PermissionModal({ 
    visible, 
    onClose, 
    title,
    message,
    buttons = [], 
    icon = "alert-circle",
    iconColor = "#f59e0b"
}) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.iconContainer}>
                        <Feather name={icon} size={48} color={iconColor} />
                    </View>

                    <Text style={styles.title}>{title}</Text>

                    <Text style={styles.message}>{message}</Text>

                    {buttons && buttons.length > 0 && (
                        <View style={styles.buttonContainer}>
                            {buttons.map((button, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.button,
                                        button.style === 'destructive' && styles.destructiveButton,
                                        button.style === 'cancel' && styles.cancelButton,
                                        button.style === 'primary' && styles.primaryButton,
                                        buttons.length === 1 && styles.singleButton
                                    ]}
                                    onPress={button.onPress}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            button.style === 'destructive' && styles.destructiveButtonText,
                                            button.style === 'cancel' && styles.cancelButtonText,
                                            button.style === 'primary' && styles.primaryButtonText,
                                        ]}
                                    >
                                        {button.text}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 12,
    },
    message: {
        fontSize: 15,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    buttonContainer: {
        gap: 12,
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    singleButton: {
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    primaryButton: {
        backgroundColor: '#10b981',
    },
    destructiveButton: {
        backgroundColor: '#ef4444',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#374151',
    },
    primaryButtonText: {
        color: '#ffffff',
    },
    destructiveButtonText: {
        color: '#ffffff',
    },
});