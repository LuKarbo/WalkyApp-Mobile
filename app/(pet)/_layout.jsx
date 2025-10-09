import { Stack, useRouter } from 'expo-router';
import { Text, TouchableOpacity } from 'react-native';

export default function PetLayout() {
    const router = useRouter();
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#6366f1',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: true,
                    headerTitle: 'Mis Mascotas',
                    headerLeft: () => (
                        <TouchableOpacity 
                            onPress={() => router.push('/(client)/settings')}
                            style={{ marginLeft: 16 }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16 }}>← Volver</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <Stack.Screen
                name="add-pet"
                options={{
                    title: 'Agregar Mascota',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="edit-pet"
                options={{
                    title: 'Editar Mascota',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="request-walk-single"
                options={{
                    headerShown: true,
                    headerTitle: 'Solicitar Paseo',
                    headerLeft: () => (
                        <TouchableOpacity 
                            onPress={() => router.push('/(pet)')}
                            style={{ marginLeft: 16 }}
                        >
                            <Text style={{ color: '#fff', fontSize: 16 }}>← Volver</Text>
                        </TouchableOpacity>
                    ),
                }}
            />
        </Stack>
    );
}