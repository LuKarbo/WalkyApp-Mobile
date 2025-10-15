import { WalksAPI } from "../API/WalksAPI.js";

export const WalksDataAccess = {
    async getAllWalks() {
        try {
            return await WalksAPI.getAllWalks();
        } catch (error) {
            throw error;
        }
    },

    async getWalkById(id) {
        try {
            return await WalksAPI.getWalkById(id);
        } catch (error) {
            throw error;
        }
    },

    async getWalksByStatus(status) {
        try {
            return await WalksAPI.getWalksByStatus(status);
        } catch (error) {
            throw error;
        }
    },

    async getWalksByWalkerId(walkerId) {
        try {
            return await WalksAPI.getWalksByWalkerId(walkerId);
        } catch (error) {
            throw error;
        }
    },

    async getWalkByOwner(ownerId) {
        try {
            return await WalksAPI.getWalkByOwner(ownerId);
        } catch (error) {
            throw error;
        }
    },

    async createWalkRequest(walkRequestData) {
        try {
            return await WalksAPI.createWalkRequest(walkRequestData);
        } catch (error) {
            throw error;
        }
    },

    async updateWalkStatus(walkId, status) {
        try {
            return await WalksAPI.updateWalkStatus(walkId, status);
        } catch (error) {
            throw error;
        }
    },

    async acceptWalkRequest(walkId) {
        try {
            return await WalksAPI.acceptWalkRequest(walkId);
        } catch (error) {
            throw error;
        }
    },

    async rejectWalkRequest(walkId) {
        try {
            return await WalksAPI.rejectWalkRequest(walkId);
        } catch (error) {
            throw error;
        }
    },

    async confirmPayment(walkId) {
        try {
            return await WalksAPI.confirmPayment(walkId);
        } catch (error) {
            throw error;
        }
    },

    async startWalk(walkId) {
        try {
            return await WalksAPI.startWalk(walkId);
        } catch (error) {
            throw error;
        }
    },

    async finishWalk(walkId) {
        try {
            return await WalksAPI.finishWalk(walkId);
        } catch (error) {
            throw error;
        }
    },

    async cancelWalk(walkId) {
        try {
            return await WalksAPI.cancelWalk(walkId);
        } catch (error) {
            throw error;
        }
    }
};