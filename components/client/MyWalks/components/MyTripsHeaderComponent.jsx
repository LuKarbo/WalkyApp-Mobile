import { LinearGradient } from 'expo-linear-gradient';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MyTripsHeaderComponent({ 
    activeTab, 
    setActiveTab, 
    setShowCreateForm, 
    activeTripsCount, 
    completedTripsCount,
    onRefresh,
    refreshing
}) {
    return (
        <LinearGradient
            colors={['#3b82f6', '#10b981']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            
            <View style={styles.bottomRow}>
                <Text style={styles.title}>Mis Paseos</Text>
                <TouchableOpacity
                    onPress={onRefresh}
                    disabled={refreshing}
                    style={styles.refreshButton}
                >
                    {refreshing ? (
                        <ActivityIndicator color="#3b82f6" size="small" />
                    ) : (
                        <Text style={styles.refreshIcon}>🔄</Text>
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "active" && styles.tabActive,
                    ]}
                    onPress={() => setActiveTab("active")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "active" && styles.tabTextActive,
                        ]}
                    >
                        Activos ({activeTripsCount})
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tab,
                        activeTab === "completed" && styles.tabActive,
                    ]}
                    onPress={() => setActiveTab("completed")}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === "completed" && styles.tabTextActive,
                        ]}
                    >
                        Historial ({completedTripsCount})
                    </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: '#ffffff',
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#ffffff',
    },
    tabTextActive: {
        color: '#3b82f6',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '500',
    },
    refreshButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    refreshIcon: {
        fontSize: 16,
    },
});