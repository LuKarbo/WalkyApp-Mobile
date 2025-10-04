import { AuthDataAccess } from "../DataAccess/AuthDataAccess.js";

export const AuthService = {
    async login(credentials) {
        // Validaciones básicas
        if (!credentials.email || !credentials.email.includes("@")) {
            throw new Error("Email inválido");
        }
        if (!credentials.password || credentials.password.length < 8) {
            throw new Error("Contraseña demasiado corta");
        }

        const user = await AuthDataAccess.login(credentials);

        return {
            id: user.id,
            fullName: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage || "https://cdn.example.com/default-avatar.png",
            suscription: user.suscription,
            token: user.token,
        };
    },

    async checkSession(token) {
        if (!token) throw new Error("No hay token");
        const user = await AuthDataAccess.checkSession(token);

        return {
            id: user.id,
            fullName: user.name,
            email: user.email,
            role: user.role,
            profileImage: user.profileImage || "https://cdn.example.com/default-avatar.png",
            suscription: user.suscription,
        };
    },

    async logout() {
        return await AuthDataAccess.logout();
    },
};