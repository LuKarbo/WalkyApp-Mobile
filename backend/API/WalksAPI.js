import apiClient from '../config/ApiClient.js';

export const WalksAPI = {
    async getAllWalks() {
        try {
            const response = await apiClient.get('/walks');
            return response.data.walks;
        } catch (error) {
            throw error;
        }
    },

    async getWalkById(id) {
        try {
            const response = await apiClient.get(`/walks/${id}`);
            return response.data.walk;
        } catch (error) {
            throw error;
        }
    },

    async getWalksByStatus(status) {
        try {
            const response = await apiClient.get(`/walks/status/${status}`);
            return response.data.walks;
        } catch (error) {
            throw error;
        }
    },

    async getWalksByWalkerId(walkerId) {
        try {
            const response = await apiClient.get(`/walks/walker/${walkerId}`);
            return response.data.walks;
        } catch (error) {
            throw error;
        }
    },

    async getWalkByOwner(ownerId) {
        try {
            const response = await apiClient.get(`/walks/owner/${ownerId}`);
            return response.data.walks;
        } catch (error) {
            throw error;
        }
    },

    async getActiveWalks() {
        try {
            const response = await apiClient.get('/walks/active');
            return response.data.walks;
        } catch (error) {
            throw error;
        }
    },

    async getScheduledWalks() {
        try {
            const response = await apiClient.get('/walks/scheduled');
            return response.data.walks;
        } catch (error) {
            throw error;
        }
    },

    async getWalksAwaitingPayment() {
        try {
            const response = await apiClient.get('/walks/awaiting-payment');
            return response.data.walks;
        } catch (error) {
            throw error;
        }
    },

    async getRequestedWalks() {
        try {
            const response = await apiClient.get('/walks/requested');
            return response.data.walks;
        } catch (error) {
            throw error;
        }
    },

    async createWalkRequest(walkRequestData) {
        try {
            const response = await apiClient.post('/walks', walkRequestData);
            return response.data.walk;
        } catch (error) {
            throw error;
        }
    },

    async updateWalkStatus(walkId, status) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/status`, { status });
            return response.data.walk;
        } catch (error) {
            throw error;
        }
    },

    async updateWalk(walkId, walkData) {
        try {
            const response = await apiClient.put(`/walks/${walkId}`, walkData);
            return response.data.walk;
        } catch (error) {
            throw error;
        }
    },

    async acceptWalkRequest(walkId) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/accept`);
            return response.data.walk;
        } catch (error) {
            throw error;
        }
    },

    async rejectWalkRequest(walkId) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/reject`);
            return response.data.walk;
        } catch (error) {
            throw error;
        }
    },

    async confirmPayment(walkId) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/confirm-payment`);
            return response.data.walk;
        } catch (error) {
            throw error;
        }
    },

    async startWalk(walkId) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/start`);
            return response.data.walk;
        } catch (error) {
            throw error;
        }
    },

    async finishWalk(walkId) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/finish`);
            return response.data.walk;
        } catch (error) {
            throw error;
        }
    },

    async cancelWalk(walkId) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/cancel`);
            return response.data.walk;
        } catch (error) {
            throw error;
        }
    },

    async deleteWalk(walkId) {
        try {
            const response = await apiClient.delete(`/walks/${walkId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async validateWalk(walkId) {
        try {
            const response = await apiClient.get(`/walks/${walkId}/validate`);
            return response.data.isValid;
        } catch (error) {
            throw error;
        }
    },

    async getWalkReceipt(walkId) {
        try {
            const response = await apiClient.get(`/walks/${walkId}/receipt`);
            return response.data.receipt;
        } catch (error) {
            throw error;
        }
    }
};