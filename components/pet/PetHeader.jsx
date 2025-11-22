import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PetHeader({ onAddPet }) {
    return (
        <View style={styles.container}>
            <View style={styles.headerSection}>
                <View>
                    <Text style={styles.title}>🐾 Mis Mascotas</Text>
                    <Text style={styles.subtitle}>
                        Gestiona tus mascotas
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={onAddPet}
                >
                    <Text style={styles.addButtonText}>+ Agregar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
        gap: 12,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
        flexShrink: 1,
    },
    subtitle: {
        fontSize: 13,
        color: '#6b7280',
        flexShrink: 1,
    },
    addButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    addButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    statCard: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    statCardPrimary: {
        backgroundColor: '#eef2ff',
        borderColor: '#c7d2fe',
    },
    statCardSuccess: {
        backgroundColor: '#d1fae5',
        borderColor: '#a7f3d0',
    },
    statCardWarning: {
        backgroundColor: '#fef3c7',
        borderColor: '#fde68a',
    },
    statLabel: {
        fontSize: 11,
        color: '#6b7280',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
});