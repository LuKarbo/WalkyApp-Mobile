import { UserService } from "../Services/UserService.js";

export const UserController = {

    async fetchUserById(id) {
        try {
            return await UserService.getUserById(id);
        } catch (error) {
            console.error('Error in UserController.fetchUserById:', error);
            throw error;
        }
    },
};