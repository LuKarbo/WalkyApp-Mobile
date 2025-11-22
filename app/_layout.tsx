import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ToastProvider } from '../backend/Context/ToastContext';
import { UserProvider } from '../backend/Context/UserContext';
import { AuthProvider, useAuth } from '../hooks/useAuth';


function AppContent() {
    const { user } = useAuth();
    return (
        <UserProvider user={user}>
            <ToastProvider>
                <StatusBar style="auto" />
                <Stack screenOptions={{ headerShown: false }} />
            </ToastProvider>
        </UserProvider>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}