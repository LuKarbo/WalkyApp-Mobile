import { UserAPI } from "../API/UserAPI.js";

export const UserDataAccess = {

    async getUserById(id) {
        return await UserAPI.getUserById(id);
    },

    async mobileUpdateUser(id, userData) {
        return await UserAPI.mobileUpdateUser(id, userData);
    }
};