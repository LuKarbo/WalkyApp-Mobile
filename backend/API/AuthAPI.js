import apiClient from '../config/ApiClient.js';

export const AuthAPI = {
    async login(credentials) {        
        try {
            
            const response = await apiClient.post('/auth/login', {
                email: credentials.email,
                password: credentials.password
            });
            
            const userData = response.data.user;
            
            if (userData.token) {
                apiClient.setToken(userData.token);
            }

            return {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                password: credentials.password,
                role: userData.role,
                profileImage: userData.profileImage || userData.profile_image,
                suscription: userData.suscription || userData.subscription || 'Basic',
                phone: userData.phone || "",
                location: userData.location || "",
                joinedDate: userData.joinedDate || userData.joined_date,
                status: userData.status,
                lastLogin: userData.lastLogin || userData.last_login,
                token: userData.token
            };
        } catch (error) {
            console.error("Error en login:", error);
            throw new Error("Credenciales inválidas o cuenta inactiva");
        }
    },

    async checkSession(token) {
        
        try {
            const response = await apiClient.post('/auth/check-session', null, {
                headers: {
                    Authorization: `Bearer ${token || apiClient.getToken()}`
                }
            });

            const userData = response.data.user;
            
            if (userData.token) {
                apiClient.setToken(userData.token);
            }

            return {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                profileImage: userData.profileImage || userData.profile_image,
                suscription: userData.suscription || userData.subscription || 'Basic',
                phone: userData.phone || "",
                location: userData.location || "",
                joinedDate: userData.joinedDate || userData.joined_date,
                status: userData.status,
                lastLogin: userData.lastLogin || userData.last_login,
                token: userData.token || token
            };
        } catch (error) {
            console.error("Error en checkSession:", error);
            apiClient.removeToken();
            throw new Error("Sesión inválida o expirada");
        }
    },

    async logout() {
        
        try {
            await apiClient.post('/auth/logout');
        } catch (error) {
            console.error("Error en logout:", error);
        }
        
        apiClient.removeToken();
        return { success: true };
    },
};