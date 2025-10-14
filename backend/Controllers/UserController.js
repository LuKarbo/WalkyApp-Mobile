import { UserService } from "../Services/UserService.js";

export const UserController = {

    async fetchUserById(id) {
        try {
            return await UserService.getUserById(id);
        } catch (error) {
            throw error;
        }
    },

    async mobileUpdateUser(id, userData) {
        try {
            return await UserService.mobileUpdateUser(id, userData);
        } catch (error) {
            throw error;
        }
    }

};