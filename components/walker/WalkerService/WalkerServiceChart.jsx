import { Ionicons } from "@expo/vector-icons";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

const WalkerServiceChart = ({ chartData }) => {
    const screenWidth = Dimensions.get("window").width - 64;

    const totalWalks = chartData ? chartData.reduce((sum, day) => sum + day.walks, 0) : 0;
    const avgWalks = chartData ? (totalWalks / 7).toFixed(1) : '0.0';

    const generateChartData = () => {
        if (!chartData || chartData.length === 0) {
            return {
                labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
                datasets: [{
                    data: [0, 0, 0, 0, 0, 0, 0]
                }]
            };
        }

        return {
            labels: chartData.map(item => item.day),
            datasets: [{
                data: chartData.map(item => item.walks)
            }]
        };
    };

    const chartConfig = {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        style: {
            borderRadius: 16
        },
        propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#3b82f6"
        },
        propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: "#e5e7eb"
        }
    };

    return (
        <View>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="bar-chart" size={24} color="#ffffff" />
                    </View>
                    <View>
                        <Text style={styles.title}>Paseos última semana</Text>
                        <Text style={styles.subtitle}>Promedio: {avgWalks} paseos/día</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.totalValue}>{totalWalks}</Text>
                    <Text style={styles.totalLabel}>Total semanal</Text>
                </View>
            </View>

            <View style={styles.chartContainer}>
                <LineChart
                    data={generateChartData()}
                    width={screenWidth}
                    height={200}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withInnerLines={true}
                    withOuterLines={true}
                    withVerticalLines={false}
                    withHorizontalLines={true}
                    withDots={true}
                    withShadow={false}
                />
            </View>

            {totalWalks === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        No hay datos de paseos completados en los últimos 7 días
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#3b82f6",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#1f2937",
    },
    subtitle: {
        fontSize: 12,
        color: "#6b7280",
        marginTop: 2,
    },
    headerRight: {
        alignItems: "flex-end",
    },
    totalValue: {
        fontSize: 24,
        fontWeight: "700",
        color: "#3b82f6",
    },
    totalLabel: {
        fontSize: 11,
        color: "#6b7280",
    },
    chartContainer: {
        backgroundColor: "#f9fafb",
        borderRadius: 12,
        padding: 8,
        marginTop: 8,
    },
    chart: {
        borderRadius: 12,
    },
    emptyContainer: {
        marginTop: 16,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 13,
        color: "#6b7280",
        textAlign: "center",
    },
});

export default WalkerServiceChart;