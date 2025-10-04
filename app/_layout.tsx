import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ToastProvider } from '../backend/Context/ToastContext';
import { AuthProvider } from '../hooks/useAuth';

export default function RootLayout() {
    return (
        <AuthProvider>
            <ToastProvider>
                <StatusBar style="auto" />
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="(client)" />
                    <Stack.Screen name="(walker)" />
                    <Stack.Screen 
                        name="profile" 
                        options={{
                            presentation: 'modal',
                            headerShown: true,
                            headerTitle: 'Mi Perfil'
                        }}
                    />
                </Stack>
            </ToastProvider>
        </AuthProvider>
    );
}