import { WalksAPI } from "../API/WalksAPI.js";

export const WalksDataAccess = {
    async getAllWalks() {
        try {
            return await WalksAPI.getAllWalks();
        } catch (error) {
            console.error('DataAccess - Error getting all walks:', error);
            throw error;
        }
    },

    async getWalkById(id) {
        try {
            return await WalksAPI.getWalkById(id);
        } catch (error) {
            console.error(`DataAccess - Error getting walk ${id}:`, error);
            throw error;
        }
    },

    async getWalksByStatus(status) {
        try {
            return await WalksAPI.getWalksByStatus(status);
        } catch (error) {
            console.error(`DataAccess - Error getting walks by status ${status}:`, error);
            throw error;
        }
    },

    async getWalksByWalkerId(walkerId) {
        try {
            return await WalksAPI.getWalksByWalkerId(walkerId);
        } catch (error) {
            console.error(`DataAccess - Error getting walks for walker ${walkerId}:`, error);
            throw error;
        }
    },

    async getWalkByOwner(ownerId) {
        try {
            return await WalksAPI.getWalkByOwner(ownerId);
        } catch (error) {
            console.error(`DataAccess - Error getting walks for owner ${ownerId}:`, error);
            throw error;
        }
    },

    async createWalkRequest(walkRequestData) {
        try {
            return await WalksAPI.createWalkRequest(walkRequestData);
        } catch (error) {
            console.error('DataAccess - Error creating walk request:', error);
            throw error;
        }
    },

    async updateWalkStatus(walkId, status) {
        try {
            return await WalksAPI.updateWalkStatus(walkId, status);
        } catch (error) {
            console.error(`DataAccess - Error updating walk ${walkId} status:`, error);
            throw error;
        }
    },

    // Métodos específicos para endpoints dedicados
    async acceptWalkRequest(walkId) {
        try {
            return await WalksAPI.acceptWalkRequest(walkId);
        } catch (error) {
            console.error(`DataAccess - Error accepting walk request ${walkId}:`, error);
            throw error;
        }
    },

    async rejectWalkRequest(walkId) {
        try {
            return await WalksAPI.rejectWalkRequest(walkId);
        } catch (error) {
            console.error(`DataAccess - Error rejecting walk request ${walkId}:`, error);
            throw error;
        }
    },

    async confirmPayment(walkId) {
        try {
            return await WalksAPI.confirmPayment(walkId);
        } catch (error) {
            console.error(`DataAccess - Error confirming payment for walk ${walkId}:`, error);
            throw error;
        }
    },

    async startWalk(walkId) {
        try {
            return await WalksAPI.startWalk(walkId);
        } catch (error) {
            console.error(`DataAccess - Error starting walk ${walkId}:`, error);
            throw error;
        }
    },

    async finishWalk(walkId) {
        try {
            return await WalksAPI.finishWalk(walkId);
        } catch (error) {
            console.error(`DataAccess - Error finishing walk ${walkId}:`, error);
            throw error;
        }
    },

    async cancelWalk(walkId) {
        try {
            return await WalksAPI.cancelWalk(walkId);
        } catch (error) {
            console.error(`DataAccess - Error finishing walk ${walkId}:`, error);
            throw error;
        }
    }
};