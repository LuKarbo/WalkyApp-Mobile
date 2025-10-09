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

function WalkCard({ walk, onPress }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'assigned':
                return '#f59e0b';
            case 'in_progress':
                return '#3b82f6';
            case 'completed':
                return '#10b981';
            default:
                return '#6b7280';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'assigned':
                return 'Asignado';
            case 'in_progress':
                return 'En Progreso';
            case 'completed':
                return 'Completado';
            default:
                return 'Desconocido';
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.cardTitle}>{walk.dogName}</Text>
                    <Text style={styles.cardSubtitle}>Cliente: {walk.clientName}</Text>
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
                    <Text style={styles.infoIcon}>🐕</Text>
                    <Text style={styles.infoText}>{walk.breed || 'Sin raza'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📅</Text>
                    <Text style={styles.infoText}>{walk.date}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>⏰</Text>
                    <Text style={styles.infoText}>{walk.time}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>⏱️</Text>
                    <Text style={styles.infoText}>Duración: {walk.duration} min</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📍</Text>
                    <Text style={styles.infoText}>{walk.location}</Text>
                </View>
            </View>

            {walk.status === 'assigned' && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            Alert.alert(
                                'Iniciar Paseo',
                                `¿Comenzar el paseo de ${walk.dogName}?`,
                                [
                                    { text: 'Cancelar', style: 'cancel' },
                                    { text: 'Iniciar', onPress: () => console.log('Iniciado') },
                                ]
                            );
                        }}
                    >
                        <Text style={styles.startButtonText}>▶️ Iniciar Paseo</Text>
                    </TouchableOpacity>
                </View>
            )}

            {walk.status === 'in_progress' && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={styles.completeButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            Alert.alert(
                                'Finalizar Paseo',
                                `¿Marcar el paseo de ${walk.dogName} como completado?`,
                                [
                                    { text: 'Cancelar', style: 'cancel' },
                                    { text: 'Completar', onPress: () => console.log('Completado') },
                                ]
                            );
                        }}
                    >
                        <Text style={styles.completeButtonText}>✓ Finalizar Paseo</Text>
                    </TouchableOpacity>
                </View>
            )}
        </TouchableOpacity>
    );
}

export default function WalkerWalksScreen() {
    const [walks, setWalks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Datos de ejemplo
    const mockWalks = [
        {
            id: 1,
            dogName: 'Max',
            breed: 'Golden Retriever',
            clientName: 'Juan Pérez',
            status: 'assigned',
            date: '05 Oct 2025',
            time: '10:00 AM',
            duration: 60,
            location: 'Parque Central',
        },
        {
            id: 2,
            dogName: 'Luna',
            breed: 'Labrador',
            clientName: 'María García',
            status: 'in_progress',
            date: '04 Oct 2025',
            time: '03:00 PM',
            duration: 30,
            location: 'Parque del Este',
        },
        {
            id: 3,
            dogName: 'Rocky',
            breed: 'Mestizo',
            clientName: 'Carlos López',
            status: 'completed',
            date: '03 Oct 2025',
            time: '09:00 AM',
            duration: 90,
            location: 'Parque Norte',
        },
    ];

    useEffect(() => {
        loadWalks();
    }, []);

    const loadWalks = async () => {
        try {
            setLoading(true);
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
            `Cliente: ${walk.clientName}\nEstado: ${walk.status}\nFecha: ${walk.date}\nHora: ${walk.time}`,
            [{ text: 'OK' }]
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🐕</Text>
            <Text style={styles.emptyTitle}>No tienes paseos asignados</Text>
            <Text style={styles.emptySubtitle}>
                Revisa la pestaña `&quot;`Solicitudes`&quot;` para aceptar nuevos paseos
            </Text>
        </View>
    );

    if (loading) {
        return <LoadingScreen message="Cargando..." />;
    }

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
    actionButtons: {
        marginTop: 12,
        gap: 8,
    },
    startButton: {
        backgroundColor: '#10b981',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    startButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
    completeButton: {
        backgroundColor: '#6366f1',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    completeButtonText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
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