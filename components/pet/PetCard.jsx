import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PetCard({ pet, onEditPet, onRequestWalk }) {
    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: pet.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.heartBadge}>
                    <Text style={styles.heartIcon}>❤️</Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name}>{pet.name}</Text>
                    <View style={styles.infoRow}>
                        {pet.weight && (
                            <View style={styles.infoBadge}>
                                <Text style={styles.infoText}>{pet.weight} kg</Text>
                            </View>
                        )}
                        {pet.age && (
                            <View style={styles.infoBadge}>
                                <Text style={styles.infoText}>{pet.age} años</Text>
                            </View>
                        )}
                    </View>
                </View>

                {pet.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {pet.description}
                    </Text>
                )}

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.walkButton}
                        onPress={() => onRequestWalk(pet)}
                    >
                        <Text style={styles.walkButtonText}>🚶 Solicitar Paseo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => onEditPet(pet)}
                    >
                        <Text style={styles.editButtonText}>✏️ Editar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        marginBottom: 16,
    },
    imageContainer: {
        position: 'relative',
        height: 200,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    heartBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heartIcon: {
        fontSize: 20,
    },
    content: {
        padding: 16,
    },
    header: {
        marginBottom: 8,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        gap: 8,
    },
    infoBadge: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    infoText: {
        fontSize: 12,
        color: '#6b7280',
        fontWeight: '500',
    },
    description: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
        marginBottom: 16,
    },
    actions: {
        gap: 8,
    },
    walkButton: {
        backgroundColor: '#6366f1',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    walkButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
    editButton: {
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#6366f1',
    },
    editButtonText: {
        color: '#6366f1',
        fontSize: 16,
        fontWeight: '600',
    },
});