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

function RequestCard({ request, onAccept, onReject }) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.cardTitle}>{request.dogName}</Text>
                    <Text style={styles.cardSubtitle}>Cliente: {request.clientName}</Text>
                </View>
                <View style={styles.newBadge}>
                    <Text style={styles.newText}>Nueva</Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>🐕</Text>
                    <Text style={styles.infoText}>{request.breed || 'Sin raza'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📅</Text>
                    <Text style={styles.infoText}>{request.date}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>⏰</Text>
                    <Text style={styles.infoText}>{request.time}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>⏱️</Text>
                    <Text style={styles.infoText}>Duración: {request.duration} min</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>📍</Text>
                    <Text style={styles.infoText}>{request.location}</Text>
                </View>
                {request.notes && (
                    <View style={styles.notesContainer}>
                        <Text style={styles.notesLabel}>Notas:</Text>
                        <Text style={styles.notesText}>{request.notes}</Text>
                    </View>
                )}
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => onReject(request)}
                >
                    <Text style={styles.rejectButtonText}>✗ Rechazar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => onAccept(request)}
                >
                    <Text style={styles.acceptButtonText}>✓ Aceptar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default function WalkerRequestsScreen() {
    const [requests, setRequests] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Datos de ejemplo
    const mockRequests = [
        {
            id: 1,
            dogName: 'Toby',
            breed: 'Beagle',
            clientName: 'Ana Martínez',
            date: '06 Oct 2025',
            time: '11:00 AM',
            duration: 60,
            location: 'Parque Sur',
            notes: 'Toby es muy juguetón, le encantan las pelotas',
        },
        {
            id: 2,
            dogName: 'Bella',
            breed: 'Poodle',
            clientName: 'Pedro Sánchez',
            date: '06 Oct 2025',
            time: '02:00 PM',
            duration: 30,
            location: 'Parque Central',
            notes: null,
        },
        {
            id: 3,
            dogName: 'Rex',
            breed: 'Pastor Alemán',
            clientName: 'Laura Díaz',
            date: '07 Oct 2025',
            time: '09:00 AM',
            duration: 90,
            location: 'Parque del Oeste',
            notes: 'Rex necesita mucho ejercicio, es muy enérgico',
        },
    ];

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            // Aquí iría la llamada a la API
            await new Promise(resolve => setTimeout(resolve, 1000));
            setRequests(mockRequests);
        } catch (error) {
            console.error('Error cargando solicitudes:', error);
            Alert.alert('Error', 'No se pudieron cargar las solicitudes');
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadRequests();
        setRefreshing(false);
    };

    const handleAccept = (request) => {
        Alert.alert(
            'Aceptar Solicitud',
            `¿Aceptar el paseo de ${request.dogName}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Aceptar',
                    onPress: async () => {
                        try {
                            // Aquí iría la llamada a la API
                            await new Promise(resolve => setTimeout(resolve, 500));
                            
                            // Remover de la lista
                            setRequests(prev => prev.filter(r => r.id !== request.id));
                            
                            Alert.alert(
                                'Solicitud Aceptada',
                                'El paseo ha sido agregado a tu lista'
                            );
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo aceptar la solicitud');
                        }
                    },
                },
            ]
        );
    };

    const handleReject = (request) => {
        Alert.alert(
            'Rechazar Solicitud',
            `¿Rechazar el paseo de ${request.dogName}?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Rechazar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Aquí iría la llamada a la API
                            await new Promise(resolve => setTimeout(resolve, 500));
                            
                            // Remover de la lista
                            setRequests(prev => prev.filter(r => r.id !== request.id));
                            
                            Alert.alert('Solicitud Rechazada', 'La solicitud ha sido rechazada');
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo rechazar la solicitud');
                        }
                    },
                },
            ]
        );
    };

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📬</Text>
            <Text style={styles.emptyTitle}>No hay solicitudes pendientes</Text>
            <Text style={styles.emptySubtitle}>
                Aquí aparecerán las nuevas solicitudes de paseos
            </Text>
        </View>
    );

    if (loading) {
        return <LoadingScreen message="Cargando..." />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={requests}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <RequestCard
                        request={item}
                        onAccept={handleAccept}
                        onReject={handleReject}
                    />
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
    newBadge: {
        backgroundColor: '#fef3c7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    newText: {
        color: '#92400e',
        fontSize: 12,
        fontWeight: '600',
    },
    cardBody: {
        gap: 8,
        marginBottom: 12,
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
    notesContainer: {
        marginTop: 8,
        padding: 12,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
    },
    notesLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 4,
    },
    notesText: {
        fontSize: 14,
        color: '#374151',
        lineHeight: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    rejectButton: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderColor: '#ef4444',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    rejectButtonText: {
        color: '#ef4444',
        fontSize: 14,
        fontWeight: '600',
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#10b981',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    acceptButtonText: {
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