import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfilePhotoSection({ selectedPhoto, onPress }) {
    return (
        <View style={styles.photoSection}>
            <TouchableOpacity onPress={onPress}>
                <Image source={{ uri: selectedPhoto }} style={styles.profileImage} />
                <View style={styles.editPhotoBadge}>
                    <Text style={styles.editPhotoIcon}>✏️</Text>
                </View>
            </TouchableOpacity>
            <Text style={styles.photoLabel}>Toca para cambiar foto</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    photoSection: {
        alignItems: 'center',
        paddingVertical: 32,
        backgroundColor: '#ffffff',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#10b981',
    },
    editPhotoBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#10b981',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#ffffff',
    },
    editPhotoIcon: {
        fontSize: 16,
    },
    photoLabel: {
        marginTop: 12,
        fontSize: 14,
        color: '#6b7280',
    },
});