import { LinearGradient } from 'expo-linear-gradient';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function MyTripsHeaderComponent_Mobile({ 
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
            style={styles.header}
        >
            <View style={styles.topRow}>
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
            
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    onPress={() => setActiveTab("active")}
                    style={[
                        styles.tab,
                        activeTab === "active" && styles.tabActive
                    ]}
                >
                    <Text style={[
                        styles.tabText,
                        activeTab === "active" && styles.tabTextActive
                    ]}>
                        Paseos Activos ({activeTripsCount})
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    onPress={() => setActiveTab("completed")}
                    style={[
                        styles.tab,
                        activeTab === "completed" && styles.tabActive
                    ]}
                >
                    <Text style={[
                        styles.tabText,
                        activeTab === "completed" && styles.tabTextActive
                    ]}>
                        Historial ({completedTripsCount})
                    </Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    header: {
        padding: 24,
        paddingTop: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    refreshButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    refreshIcon: {
        fontSize: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    tabActive: {
        backgroundColor: '#ffffff',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff',
    },
    tabTextActive: {
        color: '#3b82f6',
    },
    createButton: {
        backgroundColor: '#ffffff',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#3b82f6',
    },
});