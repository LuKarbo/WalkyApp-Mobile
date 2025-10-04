import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LoadingScreen from '../../components/common/LoadingScreen';
import { useAuth } from '../../hooks/useAuth';

function WalkCard({ walk, onPress }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#f59e0b';
            case 'in_progress':
                return '#3b82f6';
            case 'completed':
                return '#10b981';
            case 'cancelled':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending':
                return 'Pendiente';
            case 'in_progress':
                return 'En Progreso';
            case 'completed':
                return 'Completado';
            case 'cancelled':
                return 'Cancelado';
            default:
                return 'Desconocido';
        }
    };



    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.cardTitle}>{walk.dogName}</Text>
                    <Text style={styles.cardSubtitle}>{walk.breed || 'Sin raza'}</Text>
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(walk.status) },
                    ]}
                >
                    <Text style={styles.statusText}>{getStatusLabel(walk.status)}</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📅</Text>
                    <Text style={styles.infoText}>{walk.date}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>⏰</Text>
                    <Text style={styles.infoText}>{walk.time}</Text>
                </View>
                {walk.walker && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoIcon}>👤</Text>
                        <Text style={styles.infoText}>Paseador: {walk.walker}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

export default function ClientWalksScreen() {
    const { user } = useAuth();
    const [walks, setWalks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Datos de ejemplo - En producción esto vendría de la API
    const mockWalks = [
        {
            id: 1,
            dogName: 'Max',
            breed: 'Golden Retriever',
            status: 'pending',
            date: '05 Oct 2025',
            time: '10:00 AM',
            walker: null,
        },
        {
            id: 2,
            dogName: 'Luna',
            breed: 'Labrador',
            status: 'in_progress',
            date: '04 Oct 2025',
            time: '03:00 PM',
            walker: 'Carlos Gómez',
        },
        {
            id: 3,
            dogName: 'Max',
            breed: 'Golden Retriever',
            status: 'completed',
            date: '03 Oct 2025',
            time: '09:00 AM',
            walker: 'María López',
        },
    ];

    useEffect(() => {
        loadWalks();
    }, []);

    const loadWalks = async () => {
        try {
            setLoading(true);
            // Aquí iría la llamada a la API
            // const data = await WalkController.getMyWalks();
            
            // Simulación de carga
            await new Promise(resolve => setTimeout(resolve, 1000));
            setWalks(mockWalks);
        } catch (error) {
            console.error('Error cargando paseos:', error);
            Alert.alert('Error', 'No se pudieron cargar los paseos');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadWalks();
        setRefreshing(false);
    };

    const handleWalkPress = (walk) => {
        Alert.alert(
            walk.dogName,
            `Estado: ${walk.status}\nFecha: ${walk.date}\nHora: ${walk.time}`,
            [{ text: 'OK' }]
        );
    };

    if (loading) {
        return <LoadingScreen message="Cargando..." />;
    }

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🐕</Text>
            <Text style={styles.emptyTitle}>No tienes paseos programados</Text>
            <Text style={styles.emptySubtitle}>
                Solicita tu primer paseo desde la pestaña `&quot;`Solicitar`&quot;`
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={walks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <WalkCard walk={item} onPress={() => handleWalkPress(item)} />
                )}
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
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#ffffff',
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
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});