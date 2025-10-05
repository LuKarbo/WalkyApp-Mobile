import { UserDataAccess } from "../DataAccess/UserDataAccess.js";

export const UserService = {

    async getUserById(id) {
        const user = await UserDataAccess.getUserById(id);
        
        return {
            id: user.id,
            fullName: user.name,
            email: user.email.toLowerCase(),
            role: user.role,
            profileImage: user.profileImage || "https://cdn.example.com/default-avatar.png",
            phone: user.phone || "No disponible",
            location: user.location || "No disponible",
            suscription: user.suscription || "Basic",
            status: user.status || "active",
            joinedDate: user.joinedDate || new Date().toISOString(),
            lastLogin: user.lastLogin || new Date().toISOString()
        };
    },

    async mobileUpdateUser(id, userData) {
        const user = await UserDataAccess.mobileUpdateUser(id, userData);
        
        return {
            id: user.id,
            fullName: user.name,
            email: user.email.toLowerCase(),
            role: user.role,
            profileImage: user.profileImage || "https://cdn.example.com/default-avatar.png",
            phone: user.phone || "No disponible",
            location: user.location || "No disponible",
            suscription: user.suscription || "Basic",
            status: user.status || "active",
            joinedDate: user.joinedDate || new Date().toISOString(),
            lastLogin: user.lastLogin || new Date().toISOString()
        };
    }

};