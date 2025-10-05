import { Tabs, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';
import { useToast } from '../../backend/Context/ToastContext';

export default function ClientLayout() {
    const router = useRouter();
    const { showWarning } = useToast();
    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#6366f1',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: '#6366f1',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Mis Paseos',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size }}>🐕</Text>
                    ),
                }}
            />
            <Tabs.Screen
                name="request-walk"
                options={{
                    title: 'Solicitar',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size }}>➕</Text>
                    ),
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'Historial',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size }}>📋</Text>
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Ajustes',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size }}>⚙️</Text>
                    ),
                }}
            />
            <Tabs.Screen
                name="edit-profile"
                options={{
                    href: null,
                    headerShown: true,
                    headerTitle: 'Editar Perfil',
                    headerLeft: () => (
                        <TouchableOpacity 
                            onPress={() => {showWarning('Operación Cancelada.'); router.push('/settings')}}
                            style={{ marginLeft: 16 }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16 }}>← Cancelar</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
        </Tabs>
    );
}