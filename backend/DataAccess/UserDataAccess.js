import { UserAPI } from "../API/UserAPI.js";

export const UserDataAccess = {

    async getUserById(id) {
        return await UserAPI.getUserById(id);
    },
};