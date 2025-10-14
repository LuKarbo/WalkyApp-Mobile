import { SettingService } from "../Services/SettingService.js";

export const SettingController = {

    async fetchWalkerSettings(walkerId) {
        try {
            return await SettingService.getWalkerSettings(walkerId);
        } catch (error) {
            throw error;
        }
    },

    async updateGpsSettings(walkerId, gpsData) {
        try {
            return await SettingService.updateGpsSettings(walkerId, gpsData);
        } catch (error) {
            throw error;
        }
    },

    async toggleGpsTracking(walkerId) {
        try {
            return await SettingService.toggleGpsTracking(walkerId);
        } catch (error) {
            throw error;
        }
    }
};