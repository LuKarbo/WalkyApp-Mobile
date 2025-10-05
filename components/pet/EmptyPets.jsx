import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EmptyPets({ onAddPet }) {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>
                <View style={styles.mainCircle}>
                    <Text style={styles.heartIcon}>❤️</Text>
                </View>
                <View style={[styles.decorCircle, styles.decorCircle1]} />
                <View style={[styles.decorCircle, styles.decorCircle2]} />
            </View>
            
            <Text style={styles.title}>No tienes mascotas registradas</Text>
            <Text style={styles.subtitle}>
                Comienza agregando a tu primera mascota para poder gestionar sus paseos y cuidados
            </Text>
            
            <TouchableOpacity
                style={styles.addButton}
                onPress={onAddPet}
            >
                <Text style={styles.addButtonText}>+ Agregar Primera Mascota</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        paddingVertical: 80,
    },
    iconContainer: {
        position: 'relative',
        marginBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainCircle: {
        width: 128,
        height: 128,
        borderRadius: 64,
        backgroundColor: '#eef2ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heartIcon: {
        fontSize: 64,
    },
    decorCircle: {
        position: 'absolute',
        borderRadius: 999,
    },
    decorCircle1: {
        width: 48,
        height: 48,
        backgroundColor: '#ddd6fe',
        top: -8,
        right: -8,
    },
    decorCircle2: {
        width: 32,
        height: 32,
        backgroundColor: '#d1fae5',
        bottom: -8,
        left: -8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
        maxWidth: 320,
    },
    addButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});