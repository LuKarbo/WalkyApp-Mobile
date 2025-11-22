import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function ReceiptModal({ visible, onClose, receipt, loading }) {
    if (!visible) return null;

    const formatCurrency = (amount) => {
        if (!amount) return '$0';
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `$${numAmount.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        try {
            return format(new Date(date), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
        } catch {
            return 'N/A';
        }
    };

    const formatDuration = (minutes) => {
        if (!minutes) return 'N/A';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins}min`;
        }
        return `${mins} min`;
    };

    const formatDistance = (distance) => {
        if (!distance) return 'N/A';
        return distance >= 1000 
            ? `${(distance / 1000).toFixed(2)} km` 
            : `${distance} m`;
    };

    const getPaymentMethodLabel = (method) => {
        const methods = {
            'mercadopago': 'Mercado Pago',
            'cash': 'Efectivo',
            'transfer': 'Transferencia',
            'card': 'Tarjeta'
        };
        return methods[method] || method;
    };

    const getPaymentStatusLabel = (status) => {
        const statuses = {
            'completed': 'Completado',
            'pending': 'Pendiente',
            'failed': 'Fallido',
            'cancelled': 'Cancelado'
        };
        return statuses[status] || status;
    };

    if (loading) {
        return (
            <Modal
                visible={visible}
                animationType="fade"
                transparent={true}
                onRequestClose={onClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ActivityIndicator size="large" color="#6366f1" />
                        <Text style={styles.loadingText}>Cargando recibo...</Text>
                    </View>
                </View>
            </Modal>
        );
    }

    if (!receipt) {
        return (
            <Modal
                visible={visible}
                animationType="fade"
                transparent={true}
                onRequestClose={onClose}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Ionicons name="alert-circle" size={48} color="#ef4444" />
                        <Text style={styles.errorTitle}>Error</Text>
                        <Text style={styles.errorText}>No se pudo cargar el recibo</Text>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
    
    const walk = receipt.walk || {};
    const owner = receipt.owner || {};
    const walker = receipt.walker || {};
    const pets = receipt.pets || {};
    const walkerSettings = receipt.walkerSettings || {};

    // Cálculos de precio
    const totalPrice = parseFloat(walk.totalPrice || 0);
    const walkPrice = parseFloat(walk.walkPrice || 0);
    const amountPaid = parseFloat(receipt.amountPaid || 0);
    const numberOfPets = pets.ids ? pets.ids.length : 0;
    const pricePerPet = numberOfPets > 0 ? walkPrice / numberOfPets : walkPrice;
    
    // Calcular descuento si existe
    const hadDiscount = walkerSettings.hadDiscount === 1 && walkerSettings.discountPercentage > 0;
    const discountAmount = hadDiscount ? (walkPrice * walkerSettings.discountPercentage) / 100 : 0;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTop}>
                            <View>
                                <Text style={styles.headerTitle}>Recibo de Servicio</Text>
                                <Text style={styles.headerSubtitle}>
                                    Recibo #{receipt.walkId || 'N/A'}
                                </Text>
                            </View>
                            <TouchableOpacity onPress={onClose} style={styles.closeIconButton}>
                                <Ionicons name="close" size={24} color="#1f2937" />
                            </TouchableOpacity>
                        </View>

                        {receipt.paymentStatus && (
                            <View style={[styles.statusBadge, 
                                receipt.paymentStatus === 'completed' ? styles.statusCompleted : 
                                receipt.paymentStatus === 'cancelled' ? styles.statusCancelled : 
                                styles.statusActive
                            ]}>
                                <Text style={styles.statusText}>
                                    {getPaymentStatusLabel(receipt.paymentStatus)}
                                </Text>
                            </View>
                        )}
                    </View>

                    <ScrollView 
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Información General */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>📋 Información General</Text>
                            
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Fecha Programada:</Text>
                                <Text style={styles.infoValue}>
                                    {formatDate(walk.scheduledStartTime)}
                                </Text>
                            </View>

                            {walk.actualStartTime && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Inicio Real:</Text>
                                    <Text style={styles.infoValue}>
                                        {formatDate(walk.actualStartTime)}
                                    </Text>
                                </View>
                            )}

                            {walk.startAddress && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Dirección de Inicio:</Text>
                                    <Text style={styles.infoValue}>{walk.startAddress}</Text>
                                </View>
                            )}

                            {walk.actualEndTime && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Finalizado:</Text>
                                    <Text style={styles.infoValue}>
                                        {formatDate(walk.actualEndTime)}
                                    </Text>
                                </View>
                            )}

                            {walk.status && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Estado del Paseo:</Text>
                                    <Text style={styles.infoValue}>
                                        {walk.status.charAt(0).toUpperCase() + walk.status.slice(1)}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Participantes */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>👥 Participantes</Text>
                            
                            <View style={styles.participantCard}>
                                <View style={styles.participantIcon}>
                                    <Ionicons name="person" size={20} color="#6366f1" />
                                </View>
                                <View style={styles.participantInfo}>
                                    <Text style={styles.participantLabel}>Paseador</Text>
                                    <Text style={styles.participantName}>
                                        {walker.name || 'N/A'}
                                    </Text>
                                    {walker.phone && (
                                        <Text style={styles.participantDetail}>📱 {walker.phone}</Text>
                                    )}
                                    {walker.email && (
                                        <Text style={styles.participantDetail}>✉️ {walker.email}</Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.participantCard}>
                                <View style={styles.participantIcon}>
                                    <Ionicons name="person-outline" size={20} color="#10b981" />
                                </View>
                                <View style={styles.participantInfo}>
                                    <Text style={styles.participantLabel}>Cliente</Text>
                                    <Text style={styles.participantName}>
                                        {owner.name || 'N/A'}
                                    </Text>
                                    {owner.phone && (
                                        <Text style={styles.participantDetail}>📱 {owner.phone}</Text>
                                    )}
                                    {owner.email && (
                                        <Text style={styles.participantDetail}>✉️ {owner.email}</Text>
                                    )}
                                </View>
                            </View>

                            {pets.names && (
                                <View style={styles.participantCard}>
                                    <View style={styles.participantIcon}>
                                        <Ionicons name="paw" size={20} color="#f59e0b" />
                                    </View>
                                    <View style={styles.participantInfo}>
                                        <Text style={styles.participantLabel}>
                                            {numberOfPets > 1 ? `Mascotas (${numberOfPets})` : 'Mascota'}
                                        </Text>
                                        <Text style={styles.participantName}>
                                            {pets.names}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Detalles del Paseo */}
                        {(walk.duration || walk.distance) && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>📊 Detalles del Paseo</Text>
                                
                                {walk.duration ? (
                                    <View style={styles.detailCard}>
                                        <Ionicons name="time-outline" size={24} color="#3b82f6" />
                                        <View style={styles.detailInfo}>
                                            <Text style={styles.detailLabel}>Duración</Text>
                                            <Text style={styles.detailValue}>
                                                {formatDuration(walk.duration)}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.detailCard}>
                                        <Ionicons name="time-outline" size={24} color="#9ca3af" />
                                        <View style={styles.detailInfo}>
                                            <Text style={styles.detailLabel}>Duración</Text>
                                            <Text style={[styles.detailValue, { color: '#9ca3af' }]}>
                                                No registrada
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                {walk.distance ? (
                                    <View style={styles.detailCard}>
                                        <Ionicons name="navigate-outline" size={24} color="#10b981" />
                                        <View style={styles.detailInfo}>
                                            <Text style={styles.detailLabel}>Distancia Recorrida</Text>
                                            <Text style={styles.detailValue}>
                                                {formatDistance(walk.distance)}
                                            </Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.detailCard}>
                                        <Ionicons name="navigate-outline" size={24} color="#9ca3af" />
                                        <View style={styles.detailInfo}>
                                            <Text style={styles.detailLabel}>Distancia Recorrida</Text>
                                            <Text style={[styles.detailValue, { color: '#9ca3af' }]}>
                                                No registrada
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Desglose de Precio */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>💰 Desglose de Precio</Text>
                            
                            {numberOfPets > 0 && (
                                <View style={styles.priceRow}>
                                    <Text style={styles.priceLabel}>
                                        Precio por mascota (x{numberOfPets})
                                    </Text>
                                    <Text style={styles.priceValue}>
                                        {formatCurrency(pricePerPet)}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Precio del Paseo</Text>
                                <Text style={styles.priceValue}>
                                    {formatCurrency(walkPrice)}
                                </Text>
                            </View>

                            {hadDiscount && (
                                <View style={styles.priceRow}>
                                    <Text style={[styles.priceLabel, styles.discountLabel]}>
                                        Descuento ({walkerSettings.discountPercentage}%)
                                    </Text>
                                    <Text style={[styles.priceValue, styles.discountValue]}>
                                        -{formatCurrency(discountAmount)}
                                    </Text>
                                </View>
                            )}

                            <View style={styles.divider} />

                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total Pagado</Text>
                                <Text style={styles.totalValue}>
                                    {formatCurrency(amountPaid)}
                                </Text>
                            </View>
                        </View>

                        {/* Información de Pago */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>💳 Información de Pago</Text>
                            
                            {receipt.paymentMethod && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Método de Pago:</Text>
                                    <Text style={styles.infoValue}>
                                        {getPaymentMethodLabel(receipt.paymentMethod)}
                                    </Text>
                                </View>
                            )}

                            {receipt.paymentDate && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Fecha de Pago:</Text>
                                    <Text style={styles.infoValue}>
                                        {formatDate(receipt.paymentDate)}
                                    </Text>
                                </View>
                            )}

                            {receipt.paymentStatus && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Estado:</Text>
                                    <Text style={styles.infoValue}>
                                        {getPaymentStatusLabel(receipt.paymentStatus)}
                                    </Text>
                                </View>
                            )}

                            {receipt.transactionId && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>ID Transacción:</Text>
                                    <Text style={styles.infoValueSmall}>
                                        {receipt.transactionId}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Notas */}
                        {(walk.notes || receipt.paymentNotes) && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>📝 Notas</Text>
                                {walk.notes && (
                                    <View style={styles.notesCard}>
                                        <Text style={styles.notesLabel}>Notas del Paseo:</Text>
                                        <Text style={styles.notesText}>{walk.notes}</Text>
                                    </View>
                                )}
                                {receipt.paymentNotes && (
                                    <View style={[styles.notesCard, { marginTop: 8 }]}>
                                        <Text style={styles.notesLabel}>Notas del Pago:</Text>
                                        <Text style={styles.notesText}>{receipt.paymentNotes}</Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Información del Recibo */}
                        <View style={[styles.section, styles.lastSection]}>
                            <Text style={styles.sectionTitle}>ℹ️ Información del Recibo</Text>
                            
                            {receipt.createdAt && receipt.createdAt.walk && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Paseo Creado:</Text>
                                    <Text style={styles.infoValueSmall}>
                                        {formatDate(receipt.createdAt.walk)}
                                    </Text>
                                </View>
                            )}

                            {receipt.createdAt && receipt.createdAt.payment && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>Pago Registrado:</Text>
                                    <Text style={styles.infoValueSmall}>
                                        {formatDate(receipt.createdAt.payment)}
                                    </Text>
                                </View>
                            )}

                            {receipt.paymentId && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>ID del Pago:</Text>
                                    <Text style={styles.infoValueSmall}>#{receipt.paymentId}</Text>
                                </View>
                            )}

                            {receipt.walkId && (
                                <View style={styles.infoRow}>
                                    <Text style={styles.infoLabel}>ID del Paseo:</Text>
                                    <Text style={styles.infoValueSmall}>#{receipt.walkId}</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>

                    {/* Footer Button */}
                    <View style={styles.footer}>
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={onClose}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '90%', // Cambiado de maxHeight a height
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        gap: 16,
        margin: 20,
    },
    loadingText: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 12,
    },
    errorTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1f2937',
        marginTop: 12,
    },
    errorText: {
        fontSize: 14,
        color: '#6b7280',
        textAlign: 'center',
    },
    header: {
        backgroundColor: '#f9fafb',
        padding: 20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6b7280',
    },
    closeIconButton: {
        padding: 4,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusCompleted: {
        backgroundColor: '#d1fae5',
    },
    statusCancelled: {
        backgroundColor: '#fee2e2',
    },
    statusActive: {
        backgroundColor: '#dbeafe',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1f2937',
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    lastSection: {
        borderBottomWidth: 0,
        paddingBottom: 100, 
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        gap: 16,
    },
    infoLabel: {
        fontSize: 14,
        color: '#6b7280',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
        flex: 1,
        textAlign: 'right',
    },
    infoValueSmall: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1f2937',
        flex: 1,
        textAlign: 'right',
    },
    participantCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    participantIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    participantInfo: {
        flex: 1,
    },
    participantLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 2,
    },
    participantName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1f2937',
    },
    participantDetail: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
    },
    detailCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    detailInfo: {
        marginLeft: 12,
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    priceLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },
    discountLabel: {
        color: '#10b981',
        fontWeight: '600',
    },
    discountValue: {
        color: '#10b981',
    },
    divider: {
        height: 1,
        backgroundColor: '#e5e7eb',
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#eef2ff',
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#6366f1',
    },
    notesCard: {
        backgroundColor: '#fffbeb',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fef3c7',
    },
    notesLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#92400e',
        marginBottom: 6,
    },
    notesText: {
        fontSize: 14,
        color: '#92400e',
        lineHeight: 20,
    },
    footer: {
        padding: 20,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    closeButton: {
        backgroundColor: '#6366f1',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});