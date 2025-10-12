import { WalkMapService } from "../Services/WalkMapService.js";

export const WalkMapController = {

    async saveLocation(locationData) {
        try {
            return await WalkMapService.saveLocation(locationData);
        } catch (error) {
            console.error('Error in WalkMapController.saveLocation:', error);
            throw error;
        }
    },

    async getWalkRoute(walkId) {
        try {
            return await WalkMapService.getWalkRoute(walkId);
        } catch (error) {
            console.error('Error in WalkMapController.getWalkRoute:', error);
            throw error;
        }
    },

    async checkMapAvailability(walkId) {
        try {
            return await WalkMapService.checkMapAvailability(walkId);
        } catch (error) {
            console.error('Error in WalkMapController.checkMapAvailability:', error);
            throw error;
        }
    }
};