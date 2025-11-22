import { useRouter, useSegments } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import { AuthController } from '../backend/Controllers/AuthController';
import apiClient from '../backend/config/ApiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        checkSession();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';
        const inClientGroup = segments[0] === '(client)';
        const inWalkerGroup = segments[0] === '(walker)';
        const inPetGroup = segments[0] === '(pet)';

        if (!user && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (user && !isLoading) {
            if (user.role === 'client' && !inClientGroup && !inPetGroup && !inAuthGroup) {
                router.replace('/(client)');
            } else if (user.role === 'walker' && !inWalkerGroup && !inAuthGroup) {
                router.replace('/(walker)');
            }
        }
    }, [user, segments, isLoading]);

    const checkSession = async () => {
        try {
            setIsLoading(true);
            const token = await apiClient.getToken();
            
            if (token) {
                const userData = await AuthController.checkSession(token);
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
            await apiClient.removeToken();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            setError(null);
            setIsLoading(true);
            
            const userData = await AuthController.login(credentials);
            setUser(userData);
            
            return { success: true };
        } catch (error) {
            setError(error.message || 'Error al iniciar sesión');
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await AuthController.logout();
            setUser(null);
            router.replace('/(auth)/login');
        } catch (error) {
            setUser(null);
            router.replace('/(auth)/login');
        } finally {
            setIsLoading(false);
        }
    };


    const register = async (data) => {
        try {
            setError(null);
            setIsLoading(true);
            
            const userData = await AuthController.register(data);
            setUser(userData);
            
            return { success: true };
        } catch (error) {
            setError(error.message || 'Error al registrar usuario');
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const updateUser = (updatedData) => {
        setUser(prevUser => ({
            ...prevUser,
            ...updatedData
        }));
    };

    const clearError = () => setError(null);

    const value = {
        user,
        isLoading,
        error,
        login,
        logout,
        register,
        checkSession,
        updateUser,
        clearError,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};