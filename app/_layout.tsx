import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ToastProvider } from '../backend/Context/ToastContext';
import { AuthProvider } from '../hooks/useAuth';

export default function RootLayout() {
    return (
        <AuthProvider>
            <ToastProvider>
                <StatusBar style="auto" />
                <Stack screenOptions={{ headerShown: false }} />
            </ToastProvider>
        </AuthProvider>
    );
}
