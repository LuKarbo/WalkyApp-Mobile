import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import EmailInput from '../../components/auth/EmailInput';
import ErrorMessage from '../../components/auth/ErrorMessage';
import LoginButton from '../../components/auth/LoginButton';
import LogoHeader from '../../components/auth/LogoHeader';
import PasswordInput from '../../components/auth/PasswordInput';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuth();

    const handleLogin = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu email');
            return;
        }

        if (!password.trim()) {
            Alert.alert('Error', 'Por favor ingresa tu contraseña');
            return;
        }

        const result = await login({ email: email.trim(), password });

        if (!result.success) {
            Alert.alert('Error de autenticación', result.error || 'Credenciales inválidas');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <LogoHeader />

                <View style={styles.formContainer}>
                    <EmailInput
                        value={email}
                        onChangeText={setEmail}
                        editable={!isLoading}
                    />

                    <PasswordInput
                        value={password}
                        onChangeText={setPassword}
                        editable={!isLoading}
                    />

                    <ErrorMessage message={error} />

                    <LoginButton onPress={handleLogin} isLoading={isLoading} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    formContainer: {
        width: '100%',
        marginBottom: 24,
    },
});