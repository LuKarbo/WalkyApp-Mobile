import {
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

export default function MyTripsFilter({ searchQuery, setSearchQuery }) {
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="🔍 Buscar por mascota o paseador..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f9fafb',
    },
    searchInput: {
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
});