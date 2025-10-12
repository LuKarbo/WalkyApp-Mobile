import apiClient from '../config/ApiClient.js';

export const SettingAPI = {

    async getWalkerSettings(walkerId) {
        try {
            const response = await apiClient.get(`/settings/walkers/${walkerId}`);
            const settings = response.data.settings;
            
            return {
                walkerId: settings.walker_id,
                location: settings.location,
                pricePerPet: settings.price_per_pet,
                hasGPSTracker: settings.has_gps_tracker,
                hasDiscount: settings.has_discount,
                discountPercentage: settings.discount_percentage,
                hasMercadoPago: settings.has_mercadopago,
                tokenMercadoPago: settings.token_mercadopago,
                gpsTrackingEnabled: settings.gps_tracking_enabled,
                gpsTrackingInterval: settings.gps_tracking_interval,
                updatedAt: settings.updated_at
            };
        } catch (error) {
            console.error("Error obteniendo configuraciones del paseador:", error);
            throw new Error(error.response?.data?.message || "Error al obtener configuraciones");
        }
    },

    async updateGpsSettings(walkerId, gpsData) {
        try {
            const response = await apiClient.put(`/settings/walkers/${walkerId}/gps`, {
                gps_tracking_enabled: gpsData.gpsTrackingEnabled,
                gps_tracking_interval: gpsData.gpsTrackingInterval
            });
            
            const settings = response.data.settings;
            return {
                walkerId: settings.walker_id,
                location: settings.location,
                pricePerPet: settings.price_per_pet,
                hasGPSTracker: settings.has_gps_tracker,
                hasDiscount: settings.has_discount,
                discountPercentage: settings.discount_percentage,
                hasMercadoPago: settings.has_mercadopago,
                tokenMercadoPago: settings.token_mercadopago,
                gpsTrackingEnabled: settings.gps_tracking_enabled,
                gpsTrackingInterval: settings.gps_tracking_interval,
                updatedAt: settings.updated_at
            };
        } catch (error) {
            console.error("Error actualizando configuraciones de GPS:", error);
            throw new Error(error.response?.data?.message || "Error al actualizar GPS");
        }
    },

    async toggleGpsTracking(walkerId) {
        try {
            const response = await apiClient.patch(`/settings/walkers/${walkerId}/gps/toggle`);
            
            const settings = response.data.settings;
            return {
                walkerId: settings.walker_id,
                location: settings.location,
                pricePerPet: settings.price_per_pet,
                hasGPSTracker: settings.has_gps_tracker,
                hasDiscount: settings.has_discount,
                discountPercentage: settings.discount_percentage,
                hasMercadoPago: settings.has_mercadopago,
                tokenMercadoPago: settings.token_mercadopago,
                gpsTrackingEnabled: settings.gps_tracking_enabled,
                gpsTrackingInterval: settings.gps_tracking_interval,
                updatedAt: settings.updated_at
            };
        } catch (error) {
            console.error("Error alternando GPS:", error);
            throw new Error(error.response?.data?.message || "Error al alternar GPS");
        }
    }
};