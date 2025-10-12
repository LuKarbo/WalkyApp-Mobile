import { useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MyTripsFilter({ 
    searchQuery, 
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    activeTab
}) {
    const [showFilterModal, setShowFilterModal] = useState(false);

    const activeStatuses = ["Solicitado", "Esperando pago", "Agendado", "Activo"];
    const completedStatuses = ["Finalizado", "Rechazado", "Cancelado"];
    
    const availableStatuses = activeTab === "active" ? activeStatuses : completedStatuses;

    const sortOptions = [
        { value: 'date-desc', label: 'Más recientes primero' },
        { value: 'date-asc', label: 'Más antiguos primero' },
        { value: 'price-desc', label: 'Mayor precio' },
        { value: 'price-asc', label: 'Menor precio' },
    ];

    const handleClearFilters = () => {
        setSelectedStatus(null);
        setSortBy('date-desc');
        setShowFilterModal(false);
    };

    const activeFiltersCount = () => {
        let count = 0;
        if (selectedStatus) count++;
        if (sortBy !== 'date-desc') count++;
        return count;
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchRow}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="🔍 Buscar por mascota o paseador..."
                    placeholderTextColor="#9ca3af"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                
                <TouchableOpacity 
                    style={styles.filterButton}
                    onPress={() => setShowFilterModal(true)}
                >
                    <Text style={styles.filterIcon}>⚙️</Text>
                    {activeFiltersCount() > 0 && (
                        <View style={styles.filterBadge}>
                            <Text style={styles.filterBadgeText}>{activeFiltersCount()}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Modal de filtros */}
            <Modal
                visible={showFilterModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowFilterModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filtros y Ordenamiento</Text>
                            <TouchableOpacity
                                onPress={() => setShowFilterModal(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody}>
                            {/* Filtro por estado */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Estado del paseo</Text>
                                <View style={styles.statusGrid}>
                                    <TouchableOpacity
                                        style={[
                                            styles.statusChip,
                                            !selectedStatus && styles.statusChipActive
                                        ]}
                                        onPress={() => setSelectedStatus(null)}
                                    >
                                        <Text style={[
                                            styles.statusChipText,
                                            !selectedStatus && styles.statusChipTextActive
                                        ]}>
                                            Todos
                                        </Text>
                                    </TouchableOpacity>
                                    
                                    {availableStatuses.map(status => (
                                        <TouchableOpacity
                                            key={status}
                                            style={[
                                                styles.statusChip,
                                                selectedStatus === status && styles.statusChipActive
                                            ]}
                                            onPress={() => setSelectedStatus(status)}
                                        >
                                            <Text style={[
                                                styles.statusChipText,
                                                selectedStatus === status && styles.statusChipTextActive
                                            ]}>
                                                {status}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Ordenamiento */}
                            <View style={styles.filterSection}>
                                <Text style={styles.filterSectionTitle}>Ordenar por</Text>
                                {sortOptions.map(option => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            styles.sortOption,
                                            sortBy === option.value && styles.sortOptionActive
                                        ]}
                                        onPress={() => setSortBy(option.value)}
                                    >
                                        <View style={styles.radioButton}>
                                            {sortBy === option.value && (
                                                <View style={styles.radioButtonInner} />
                                            )}
                                        </View>
                                        <Text style={[
                                            styles.sortOptionText,
                                            sortBy === option.value && styles.sortOptionTextActive
                                        ]}>
                                            {option.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.clearButton}
                                onPress={handleClearFilters}
                            >
                                <Text style={styles.clearButtonText}>Limpiar filtros</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.applyButton}
                                onPress={() => setShowFilterModal(false)}
                            >
                                <Text style={styles.applyButtonText}>Aplicar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        backgroundColor: '#f9fafb',
    },
    searchRow: {
        flexDirection: 'row',
        gap: 8,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#1f2937',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: '#ffffff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    filterIcon: {
        fontSize: 20,
    },
    filterBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#ef4444',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterBadgeText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 24,
        color: '#6b7280',
    },
    modalBody: {
        padding: 20,
    },
    filterSection: {
        marginBottom: 24,
    },
    filterSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: 12,
    },
    statusGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    statusChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    statusChipActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    statusChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
    },
    statusChipTextActive: {
        color: '#ffffff',
    },
    sortOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    sortOptionActive: {
        backgroundColor: '#eff6ff',
        borderColor: '#3b82f6',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#d1d5db',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3b82f6',
    },
    sortOptionText: {
        fontSize: 14,
        color: '#6b7280',
    },
    sortOptionTextActive: {
        color: '#1f2937',
        fontWeight: '600',
    },
    modalFooter: {
        flexDirection: 'row',
        gap: 12,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    clearButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#3b82f6',
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
});