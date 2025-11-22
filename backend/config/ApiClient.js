import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_BASE_URL = (Constants?.manifest?.extra?.API_BASE_URL) || process.env.API_BASE_URL;

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
        this.tokenKey = 'walky_token';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        const token = await this.getToken();
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, config);
            
            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                throw new Error('Error al procesar respuesta del servidor');
            }

            if (!response.ok) {
                throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Error de conexión. Verifique que el servidor esté ejecutándose.');
            }
            throw error;
        }
    }

    async get(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'GET' });
    }

    async post(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined
        });
    }

    async put(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined
        });
    }

    async patch(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined
        });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }

    async getToken() {
        try {
            return await AsyncStorage.getItem(this.tokenKey);
        } catch (error) {
            return null;
        }
    }

    async setToken(token) {
        try {
            if (token) {
                await AsyncStorage.setItem(this.tokenKey, token);
            } else {
                await AsyncStorage.removeItem(this.tokenKey);
            }
        } catch (error) {
            
        }
    }

    async removeToken() {
        try {
            await AsyncStorage.removeItem(this.tokenKey);
        } catch (error) {
            
        }
    }

    async hasToken() {
        const token = await this.getToken();
        return !!token;
    }

    setBaseURL(url) {
        this.baseURL = url;
    }

    getBaseURL() {
        return this.baseURL;
    }
}

const apiClient = new ApiClient();

export default apiClient;