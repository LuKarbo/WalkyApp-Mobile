import { SettingService } from "../Services/SettingService.js";

export const SettingController = {

    async fetchWalkerSettings(walkerId) {
        try {
            return await SettingService.getWalkerSettings(walkerId);
        } catch (error) {
            console.error('Error in SettingController.fetchWalkerSettings:', error);
            throw error;
        }
    },

    async updateGpsSettings(walkerId, gpsData) {
        try {
            return await SettingService.updateGpsSettings(walkerId, gpsData);
        } catch (error) {
            console.error('Error in SettingController.updateGpsSettings:', error);
            throw error;
        }
    },

    async toggleGpsTracking(walkerId) {
        try {
            return await SettingService.toggleGpsTracking(walkerId);
        } catch (error) {
            console.error('Error in SettingController.toggleGpsTracking:', error);
            throw error;
        }
    }
};