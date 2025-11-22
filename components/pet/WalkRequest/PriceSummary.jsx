import { StyleSheet, Text, View } from 'react-native';

export default function PriceSummary({ walkerSettings, selectedPets, calculateFinalPrice }) {
    const basePrice = walkerSettings?.pricePerPet || 15000;
    const petCount = selectedPets.length;
    const subtotal = basePrice * petCount;
    const hasDiscount = walkerSettings?.hasDiscount && walkerSettings?.discountPercentage > 0;
    const discountAmount = hasDiscount ? subtotal * (walkerSettings.discountPercentage / 100) : 0;
    const finalPrice = calculateFinalPrice();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Resumen de Precio</Text>
            
            <View style={styles.row}>
                <Text style={styles.label}>
                    Precio por mascota (x{petCount})
                </Text>
                <Text style={styles.value}>
                    ${basePrice.toLocaleString()} x {petCount}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Subtotal</Text>
                <Text style={styles.value}>${subtotal.toLocaleString()}</Text>
            </View>

            {hasDiscount && (
                <View style={styles.row}>
                    <Text style={styles.discountLabel}>
                        Descuento ({walkerSettings.discountPercentage}%)
                    </Text>
                    <Text style={styles.discountValue}>
                        -${discountAmount.toLocaleString()}
                    </Text>
                </View>
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${finalPrice.toLocaleString()}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#eef2ff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1f2937',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#6b7280',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1f2937',
    },
    discountLabel: {
        fontSize: 14,
        color: '#10b981',
        fontWeight: '600',
    },
    discountValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#10b981',
    },
    divider: {
        height: 1,
        backgroundColor: '#c7d2fe',
        marginVertical: 12,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1f2937',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '700',
        color: '#6366f1',
    },
});