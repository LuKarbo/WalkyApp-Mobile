import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WalkerController } from '../../../backend/Controllers/WalkerController';
import WalkerCard from './WalkerCard';

export default function WalkerSelector({ onWalkerSelect, onBack }) {
    const [walkers, setWalkers] = useState([]);
    const [walkersSettings, setWalkersSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    
    useEffect(() => {
        loadWalkers();
    }, []);

    const loadWalkers = async () => {
        try {
            setLoading(true);
            setError(null);
            const walkersData = await WalkerController.fetchWalkers();
            const availableWalkers = walkersData.filter(walker => !walker.isPlaceholder);
            setWalkers(availableWalkers);
            await loadAllWalkersSettings(availableWalkers);
        } catch (err) {
            setError('Error al cargar paseadores');
            console.error('Error loading walkers:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadAllWalkersSettings = async (walkersList) => {
        const settingsPromises = walkersList.map(async (walker) => {
            try {
                const settings = await WalkerController.fetchWalkerSettings(walker.id);
                return { walkerId: walker.id, settings };
            } catch (err) {
                console.error(`Error loading settings for walker ${walker.id}:`, err);
                return {
                    walkerId: walker.id,
                    settings: {
                        pricePerPet: 15000,
                        hasGPSTracker: false,
                        hasDiscount: false,
                        discountPercentage: 0
                    }
                };
            }
        });

        const settingsResults = await Promise.all(settingsPromises);
        const settingsMap = {};
        settingsResults.forEach(({ walkerId, settings }) => {
            settingsMap[walkerId] = settings;
        });
        setWalkersSettings(settingsMap);
    };

    const handleWalkerSelect = (walker) => {
        onWalkerSelect(walker, walkersSettings[walker.id]);
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>Cargando paseadores...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="alert-circle" size={48} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadWalkers}>
                    <Text style={styles.retryText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (walkers.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="people" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>No hay paseadores disponibles</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#6366f1" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Ionicons name="people" size={24} color="#6366f1" />
                    <Text style={styles.title}>Selecciona un paseador</Text>
                </View>
            </View>

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {walkers.map(walker => (
                    <WalkerCard
                        key={walker.id}
                        walker={walker}
                        walkerSettings={walkersSettings[walker.id]}
                        onSelect={handleWalkerSelect}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9fafb',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginLeft: 8,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    loadingText: {
        marginTop: 12,
        color: '#6b7280',
        fontSize: 16,
    },
    errorText: {
        marginTop: 12,
        color: '#ef4444',
        fontSize: 16,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#6366f1',
        borderRadius: 8,
    },
    retryText: {
        color: '#ffffff',
        fontWeight: '600',
    },
    emptyText: {
        marginTop: 12,
        color: '#9ca3af',
        fontSize: 16,
    },
});