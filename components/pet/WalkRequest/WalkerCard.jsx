import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WalkerCard({ walker, walkerSettings, onSelect }) {
    const pricePerPet = walkerSettings?.pricePerPet || 15000;
    const hasGPSTracking = walkerSettings?.hasGPSTracker || false;
    const hasDiscount = walkerSettings?.hasDiscount && walkerSettings?.discountPercentage > 0;

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={() => onSelect(walker)}
            activeOpacity={0.7}
        >
            <View style={styles.cardContent}>
                <Image
                    source={{ uri: walker.image }}
                    style={styles.avatar}
                    defaultSource={walker.image}
                />
                <View style={styles.info}>
                    <View style={styles.header}>
                        <Text style={styles.name}>{walker.name}</Text>
                        <View style={styles.badges}>
                            {walker.verified && (
                                <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                            )}
                            {hasGPSTracking ? (
                                <Ionicons name="navigate" size={20} color="#10b981" />
                            ) : (
                                <Ionicons name="navigate-outline" size={20} color="#9ca3af" />
                            )}
                        </View>
                    </View>
                    
                    <View style={styles.location}>
                        <Ionicons name="location" size={14} color="#6b7280" />
                        <Text style={styles.locationText}>
                            {walker.location || 'Ubicación no disponible'}
                        </Text>
                    </View>

                    <View style={styles.details}>
                        <View style={styles.rating}>
                            <Ionicons name="star" size={16} color="#fbbf24" />
                            <Text style={styles.ratingText}>{walker.rating || '5.0'}</Text>
                        </View>
                        
                        <View style={styles.priceContainer}>
                            <Text style={styles.price}>
                                ${pricePerPet.toLocaleString()}
                            </Text>
                            {hasDiscount && (
                                <Text style={styles.discount}>
                                    {walkerSettings.discountPercentage}% off
                                </Text>
                            )}
                        </View>
                    </View>

                    {walker.experience && (
                        <Text style={styles.experience} numberOfLines={2}>
                            {walker.experience}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    cardContent: {
        flexDirection: 'row',
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
        flex: 1,
    },
    badges: {
        flexDirection: 'row',
        gap: 6,
    },
    location: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationText: {
        fontSize: 13,
        color: '#6b7280',
        marginLeft: 4,
    },
    details: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    price: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6366f1',
    },
    discount: {
        fontSize: 11,
        color: '#10b981',
        fontWeight: '600',
    },
    experience: {
        fontSize: 13,
        color: '#6b7280',
        lineHeight: 18,
    },
});