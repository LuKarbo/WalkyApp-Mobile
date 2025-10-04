import { Tabs, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';
import { useToast } from '../../backend/Context/ToastContext';

export default function WalkerLayout() {
    const router = useRouter();
    const { showWarning } = useToast();

    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#10b981',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: '#10b981',
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
                    title: 'Paseos',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size }}>🐕</Text>
                    ),
                }}
            />
            <Tabs.Screen
                name="requests"
                options={{
                    title: 'Solicitudes',
                    tabBarIcon: ({ color, size }) => (
                        <Text style={{ fontSize: size }}>📬</Text>
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
                            onPress={() => {showWarning('Operación Cancelada.'); router.back()}}
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