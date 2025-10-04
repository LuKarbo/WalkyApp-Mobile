import apiClient from '../config/ApiClient.js';

export const UserAPI = {

    async getUserById(id) {
        console.log("UsersAPI - Obteniendo usuario por ID:", id);
        
        try {
            const response = await apiClient.get(`/users/${id}`);
            const user = response.data.user;
            
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImage: user.profileImage || user.profile_image,
                suscription: user.suscription || user.subscription || 'Basic',
                phone: user.phone || "",
                location: user.location || "",
                joinedDate: user.joinedDate || user.joined_date,
                status: user.status,
                lastLogin: user.lastLogin || user.last_login
            };
        } catch (error) {
            console.error("Error obteniendo usuario por ID:", error);
            throw new Error("Usuario no encontrado");
        }
    },
};