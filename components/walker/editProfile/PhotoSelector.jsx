import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PhotoSelector({ photos, selectedPhoto, onSelectPhoto, visible }) {
    if (!visible) return null;

    return (
        <View style={styles.photoSelector}>
            <Text style={styles.sectionTitle}>Selecciona una foto</Text>
            <View style={styles.photoGrid}>
                {photos.map((photo, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => onSelectPhoto(photo)}
                        style={[
                            styles.photoOption,
                            selectedPhoto === photo && styles.photoOptionSelected,
                        ]}
                    >
                        <Image source={{ uri: photo }} style={styles.photoOptionImage} />
                        {selectedPhoto === photo && (
                            <View style={styles.selectedBadge}>
                                <Text style={styles.selectedIcon}>✓</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    photoSelector: {
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16,
    },
    photoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        justifyContent: 'center',
    },
    photoOption: {
        position: 'relative',
    },
    photoOptionSelected: {
        opacity: 1,
    },
    photoOptionImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: '#e5e7eb',
    },
    selectedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#10b981',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
    selectedIcon: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 'bold',
    },
});