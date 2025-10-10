import apiClient from '../config/ApiClient.js';

export const WalksAPI = {
    async getAllWalks() {
        try {
            const response = await apiClient.get('/walks');
            return response.data.walks;
        } catch (error) {
            console.error('Error fetching all walks:', error);
            throw error;
        }
    },

    async getWalkById(id) {
        try {
            const response = await apiClient.get(`/walks/${id}`);
            return response.data.walk;
        } catch (error) {
            console.error(`Error fetching walk ${id}:`, error);
            throw error;
        }
    },

    async getWalksByStatus(status) {
        try {
            const response = await apiClient.get(`/walks/status/${status}`);
            return response.data.walks;
        } catch (error) {
            console.error(`Error fetching walks by status ${status}:`, error);
            throw error;
        }
    },

    async getWalksByWalkerId(walkerId) {
        try {
            const response = await apiClient.get(`/walks/walker/${walkerId}`);
            return response.data.walks;
        } catch (error) {
            console.error(`Error fetching walks for walker ${walkerId}:`, error);
            throw error;
        }
    },

    async getWalkByOwner(ownerId) {
        try {
            const response = await apiClient.get(`/walks/owner/${ownerId}`);
            return response.data.walks;
        } catch (error) {
            console.error(`Error fetching walks for owner ${ownerId}:`, error);
            throw error;
        }
    },

    async getActiveWalks() {
        try {
            const response = await apiClient.get('/walks/active');
            return response.data.walks;
        } catch (error) {
            console.error('Error fetching active walks:', error);
            throw error;
        }
    },

    async getScheduledWalks() {
        try {
            const response = await apiClient.get('/walks/scheduled');
            return response.data.walks;
        } catch (error) {
            console.error('Error fetching scheduled walks:', error);
            throw error;
        }
    },

    async getWalksAwaitingPayment() {
        try {
            const response = await apiClient.get('/walks/awaiting-payment');
            return response.data.walks;
        } catch (error) {
            console.error('Error fetching walks awaiting payment:', error);
            throw error;
        }
    },

    async getRequestedWalks() {
        try {
            const response = await apiClient.get('/walks/requested');
            return response.data.walks;
        } catch (error) {
            console.error('Error fetching requested walks:', error);
            throw error;
        }
    },

    async createWalkRequest(walkRequestData) {
        try {
            const response = await apiClient.post('/walks', walkRequestData);
            return response.data.walk;
        } catch (error) {
            console.error('Error creating walk request:', error);
            throw error;
        }
    },

    async updateWalkStatus(walkId, status) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/status`, { status });
            return response.data.walk;
        } catch (error) {
            console.error(`Error updating walk ${walkId} status:`, error);
            throw error;
        }
    },

    async updateWalk(walkId, walkData) {
        try {
            const response = await apiClient.put(`/walks/${walkId}`, walkData);
            return response.data.walk;
        } catch (error) {
            console.error(`Error updating walk ${walkId}:`, error);
            throw error;
        }
    },

    async acceptWalkRequest(walkId) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/accept`);
            return response.data.walk;
        } catch (error) {
            console.error(`Error accepting walk request ${walkId}:`, error);
            throw error;
        }
    },

    async rejectWalkRequest(walkId) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/reject`);
            return response.data.walk;
        } catch (error) {
            console.error(`Error rejecting walk request ${walkId}:`, error);
            throw error;
        }
    },

    async confirmPayment(walkId) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/confirm-payment`);
            return response.data.walk;
        } catch (error) {
            console.error(`Error confirming payment for walk ${walkId}:`, error);
            throw error;
        }
    },

    async startWalk(walkId) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/start`);
            return response.data.walk;
        } catch (error) {
            console.error(`Error starting walk ${walkId}:`, error);
            throw error;
        }
    },

    async finishWalk(walkId) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/finish`);
            return response.data.walk;
        } catch (error) {
            console.error(`Error finishing walk ${walkId}:`, error);
            throw error;
        }
    },

    async cancelWalk(walkId) {
        try {
            const response = await apiClient.patch(`/walks/${walkId}/cancel`);
            return response.data.walk;
        } catch (error) {
            console.error(`Error cancel walk ${walkId}:`, error);
            throw error;
        }
    },

    async deleteWalk(walkId) {
        try {
            const response = await apiClient.delete(`/walks/${walkId}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting walk ${walkId}:`, error);
            throw error;
        }
    },

    async validateWalk(walkId) {
        try {
            const response = await apiClient.get(`/walks/${walkId}/validate`);
            return response.data.isValid;
        } catch (error) {
            console.error(`Error validating walk ${walkId}:`, error);
            throw error;
        }
    }
};