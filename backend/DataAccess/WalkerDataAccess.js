import { WalkerAPI } from "../API/WalkerAPI.js";

export const WalkerDataAccess = {
    async getAllWalkers() {
        try {
            return await WalkerAPI.getAllWalkers();
        } catch (error) {
            console.error('DataAccess - Error al obtener paseadores:', error);
            throw error;
        }
    },

    async getWalkerById(id) {
        try {
            return await WalkerAPI.getWalkerById(id);
        } catch (error) {
            console.error(`DataAccess - Error al obtener paseador ${id}:`, error);
            throw error;
        }
    },

    async getWalkerSettings(walkerId) {
        try {
            return await WalkerAPI.getWalkerSettings(walkerId);
        } catch (error) {
            console.error(`DataAccess - Error al obtener configuraciones del paseador ${walkerId}:`, error);
            throw error;
        }
    },

    async updateWalkerSettings(walkerId, settings) {
        try {
            return await WalkerAPI.updateWalkerSettings(walkerId, settings);
        } catch (error) {
            console.error(`DataAccess - Error al actualizar configuraciones del paseador ${walkerId}:`, error);
            throw error;
        }
    },

    async getWalkerEarnings(walkerId) {
        try {
            return await WalkerAPI.getWalkerEarnings(walkerId);
        } catch (error) {
            console.error(`DataAccess - Error al obtener ganancias del paseador ${walkerId}:`, error);
            throw error;
        }
    },

    async updateWalkerLocation(walkerId, location) {
        try {
            return await WalkerAPI.updateWalkerLocation(walkerId, location);
        } catch (error) {
            console.error(`DataAccess - Error al actualizar ubicación del paseador ${walkerId}:`, error);
            throw error;
        }
    },

    async updateWalkerPricing(walkerId, pricingData) {
        try {
            return await WalkerAPI.updateWalkerPricing(walkerId, pricingData);
        } catch (error) {
            console.error(`DataAccess - Error al actualizar precios del paseador ${walkerId}:`, error);
            throw error;
        }
    },

    async searchWalkers(filters) {
        try {
            return await WalkerAPI.searchWalkers(filters);
        } catch (error) {
            console.error('DataAccess - Error al buscar paseadores:', error);
            throw error;
        }
    },

    async validateWalker(walkerId) {
        try {
            return await WalkerAPI.validateWalker(walkerId);
        } catch (error) {
            console.error(`DataAccess - Error al validar paseador ${walkerId}:`, error);
            throw error;
        }
    },

    async updateWalkerMercadoPago(walkerId, mercadoPagoData) {
        try {
            return await WalkerAPI.updateWalkerMercadoPago(walkerId, mercadoPagoData);
        } catch (error) {
            console.error(`DataAccess - Error al actualizar MercadoPago del paseador ${walkerId}:`, error);
            throw error;
        }
    }

};