import { Image, StyleSheet, Text, View } from 'react-native';

export default function ProfileHeader({ user, getRoleBadgeColor, getRoleLabel }) {
    return (
        <View style={styles.header}>
            {user?.profileImage ? (
                <Image
                    source={{ uri: user.profileImage }}
                    style={styles.profileImage}
                />
            ) : (
                <View style={styles.profilePlaceholder}>
                    <Text style={styles.profileInitial}>
                        {user?.fullName?.[0]?.toUpperCase() || 'U'}
                    </Text>
                </View>
            )}
            
            <Text style={styles.name}>{user?.fullName || 'Usuario'}</Text>
            
            <View
                style={[
                    styles.roleBadge,
                    { backgroundColor: getRoleBadgeColor(user?.role) },
                ]}
            >
                <Text style={styles.roleBadgeText}>
                    {getRoleLabel(user?.role)}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#ffffff',
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#6366f1',
    },
    profilePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    profileInitial: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
    },
    roleBadge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    roleBadgeText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '600',
    },
});