import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

const WalkerServiceEarnings = ({ earnings }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const calculateAveragePerWalk = () => {
        if (!earnings || !earnings.completedWalks || earnings.completedWalks === 0) {
            return 0;
        }
        return earnings.total / earnings.completedWalks;
    };

    const getCurrentMonth = () => {
        return new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    };

    return (
        <View>
            <View style={styles.titleContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="cash" size={24} color="#ffffff" />
                </View>
                <Text style={styles.title}>Ganancias</Text>
            </View>

            <View style={styles.earningsContainer}>
                <View style={styles.earningCard}>
                    <View style={styles.earningContent}>
                        <View>
                            <Text style={styles.earningLabel}>Ganancia mensual</Text>
                            <Text style={styles.earningValue}>
                                {earnings ? formatCurrency(earnings.monthly) : formatCurrency(0)}
                            </Text>
                            <Text style={styles.earningSubtext}>{getCurrentMonth()}</Text>
                        </View>
                        <View style={styles.earningIcon}>
                            <Ionicons name="trending-up" size={24} color="#10b981" />
                        </View>
                    </View>
                </View>

                <View style={[styles.earningCard, styles.earningCardBlue]}>
                    <View style={styles.earningContent}>
                        <View>
                            <Text style={styles.earningLabel}>Ganancia total</Text>
                            <Text style={styles.earningValue}>
                                {earnings ? formatCurrency(earnings.total) : formatCurrency(0)}
                            </Text>
                            <Text style={styles.earningSubtext}>
                                {earnings ? `${earnings.completedWalks} paseos completados` : '0 paseos completados'}
                            </Text>
                        </View>
                        <View style={styles.earningIcon}>
                            <Ionicons name="wallet" size={24} color="#3b82f6" />
                        </View>
                    </View>
                </View>

                {earnings && earnings.completedWalks > 0 && (
                    <View style={[styles.earningCard, styles.earningCardPurple]}>
                        <View style={styles.earningContent}>
                            <Text style={styles.earningLabel}>Promedio por paseo</Text>
                            <Text style={styles.earningValue}>
                                {formatCurrency(calculateAveragePerWalk())}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#10b981",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1f2937",
    },
    earningsContainer: {
        gap: 12,
    },
    earningCard: {
        backgroundColor: "#d1fae5",
        borderRadius: 12,
        padding: 16,
    },
    earningCardBlue: {
        backgroundColor: "#dbeafe",
    },
    earningCardPurple: {
        backgroundColor: "#e9d5ff",
    },
    earningContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    earningLabel: {
        fontSize: 13,
        color: "#6b7280",
        fontWeight: "500",
        marginBottom: 4,
    },
    earningValue: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1f2937",
        marginBottom: 2,
    },
    earningSubtext: {
        fontSize: 11,
        color: "#6b7280",
    },
    earningIcon: {
        marginLeft: 12,
    },
});

export default WalkerServiceEarnings;