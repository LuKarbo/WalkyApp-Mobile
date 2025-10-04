import { useEffect, useState } from 'react';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import LoadingScreen from '../../components/common/LoadingScreen';

function HistoryCard({ walk }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.cardTitle}>{walk.dogName}</Text>
                    <Text style={styles.cardSubtitle}>Cliente: {walk.clientName}</Text>
                </View>
                <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>✓ Completado</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>🐕</Text>
                    <Text style={styles.infoText}>{walk.breed || 'Sin raza'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📅</Text>
                    <Text style={styles.infoText}>{walk.date}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>⏱️</Text>
                    <Text style={styles.infoText}>Duración: {walk.duration} min</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📍</Text>
                    <Text style={styles.infoText}>{walk.location}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>💰</Text>
                    <Text style={[styles.infoText, styles.earnings]}>
                        Ganancia: ${walk.earnings}
                    </Text>
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

export default function WalkerHistoryScreen() {
    const [history, setHistory] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalWalks: 0,
        totalEarnings: 0,
        avgRating: 0,
    });

    // Datos de ejemplo
    const mockHistory = [
        {
            id: 1,
            dogName: 'Rocky',
            breed: 'Mestizo',
            clientName: 'Carlos López',
            date: '03 Oct 2025',
            duration: 90,
            location: 'Parque Norte',
            earnings: 45,
            rating: 5,
        },
        {
            id: 2,
            dogName: 'Bella',
            breed: 'Poodle',
            clientName: 'Laura Fernández',
            date: '02 Oct 2025',
            duration: 60,
            location: 'Parque Central',
            earnings: 30,
            rating: 5,
        },
        {
            id: 3,
            dogName: 'Max',
            breed: 'Golden Retriever',
            clientName: 'Juan Pérez',
            date: '01 Oct 2025',
            duration: 30,
            location: 'Parque Sur',
            earnings: 15,
            rating: 4,
        },
    ];

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setHistory(mockHistory);

            const totalWalks = mockHistory.length;
            const totalEarnings = mockHistory.reduce((sum, w) => sum + w.earnings, 0);
            const avgRating =
                mockHistory.reduce((sum, w) => sum + (w.rating || 0), 0) / totalWalks;

            setStats({ totalWalks, totalEarnings, avgRating: avgRating.toFixed(1) });
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

    const renderHeader = () => (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.totalWalks}</Text>
                <Text style={styles.statLabel}>Paseos</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>${stats.totalEarnings}</Text>
                <Text style={styles.statLabel}>Ganancias</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>⭐ {stats.avgRating}</Text>
                <Text style={styles.statLabel}>Promedio</Text>
            </View>
        </View>
    );

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
                ListHeaderComponent={history.length > 0 ? renderHeader : null}
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
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#10b981',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
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
    earnings: {
        fontWeight: '600',
        color: '#10b981',
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