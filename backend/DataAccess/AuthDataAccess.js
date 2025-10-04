import { AuthAPI } from "../API/AuthAPI.js";

export const AuthDataAccess = {
    async login(credentials) {
        return await AuthAPI.login(credentials);
    },
    
    async checkSession(token) {
        return await AuthAPI.checkSession(token);
    },

    async logout() {
        return await AuthAPI.logout();
    },
};
