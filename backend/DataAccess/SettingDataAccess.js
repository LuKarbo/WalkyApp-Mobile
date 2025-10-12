import { SettingAPI } from "../API/SettingAPI.js";

export const SettingDataAccess = {

    async getWalkerSettings(walkerId) {
        return await SettingAPI.getWalkerSettings(walkerId);
    },

    async updateGpsSettings(walkerId, gpsData) {
        return await SettingAPI.updateGpsSettings(walkerId, gpsData);
    },

    async toggleGpsTracking(walkerId) {
        return await SettingAPI.toggleGpsTracking(walkerId);
    }
};