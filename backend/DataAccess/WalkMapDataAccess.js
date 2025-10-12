import { WalkMapAPI } from "../API/WalkMapAPI.js";

export const WalkMapDataAccess = {

    async saveLocation(locationData) {
        return await WalkMapAPI.saveLocation(locationData);
    },

    async getWalkRoute(walkId) {
        return await WalkMapAPI.getWalkRoute(walkId);
    },

    async checkMapAvailability(walkId) {
        return await WalkMapAPI.checkMapAvailability(walkId);
    }
};