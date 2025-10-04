import { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View
} from 'react-native';
import LoadingScreen from '../../components/common/LoadingScreen';

function HistoryCard({ walk }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.cardTitle}>{walk.dogName}</Text>
                    <Text style={styles.cardSubtitle}>{walk.breed || 'Sin raza'}</Text>
                </View>
                <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>✓ Completado</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📅</Text>
                    <Text style={styles.infoText}>{walk.date}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>⏱️</Text>
                    <Text style={styles.infoText}>Duración: {walk.duration} min</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>👤</Text>
                    <Text style={styles.infoText}>Paseador: {walk.walker}</Text>
                </View>
                {walk.rating && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>⭐</Text>
                        <Text style={styles.infoText}>
                            Calificación: {walk.rating}/5
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

export default function ClientHistoryScreen() {
    const [history, setHistory] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const mockHistory = [
        {
            id: 1,
            dogName: 'Max',
            breed: 'Golden Retriever',
            date: '03 Oct 2025',
            duration: 60,
            walker: 'María López',
            rating: 5,
        },
        {
            id: 2,
            dogName: 'Luna',
            breed: 'Labrador',
            date: '01 Oct 2025',
            duration: 30,
            walker: 'Carlos Gómez',
            rating: 4,
        },
        {
            id: 3,
            dogName: 'Max',
            breed: 'Golden Retriever',
            date: '28 Sep 2025',
            duration: 90,
            walker: 'Ana Martínez',
            rating: 5,
        },
    ];

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            // Aquí iría la llamada a la API
            await new Promise(resolve => setTimeout(resolve, 1000));
            setHistory(mockHistory);
        } catch (error) {
            console.error('Error cargando historial:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHistory();
        setRefreshing(false);
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Sin historial</Text>
            <Text style={styles.emptySubtitle}>
                Aquí aparecerán tus paseos completados
            </Text>
        </View>
    );

    if (loading) {
        return <LoadingScreen message="Cargando..." />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={history}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <HistoryCard walk={item} />}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={!loading && renderEmptyState()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    listContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    completedBadge: {
        backgroundColor: '#d1fae5',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    completedText: {
        color: '#065f46',
        fontSize: 12,
        fontWeight: '600',
    },
    cardBody: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#374151',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
});