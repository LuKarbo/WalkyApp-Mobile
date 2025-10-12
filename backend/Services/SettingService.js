import { SettingDataAccess } from "../DataAccess/SettingDataAccess.js";

export const SettingService = {

    async getWalkerSettings(walkerId) {
        const settings = await SettingDataAccess.getWalkerSettings(walkerId);
        
        return {
            walkerId: settings.walkerId,
            location: settings.location || "No disponible",
            pricePerPet: settings.pricePerPet || 0,
            hasGPSTracker: settings.hasGPSTracker || false,
            hasDiscount: settings.hasDiscount || false,
            discountPercentage: settings.discountPercentage || 0,
            hasMercadoPago: settings.hasMercadoPago || false,
            tokenMercadoPago: settings.tokenMercadoPago || null,
            gpsTrackingEnabled: settings.gpsTrackingEnabled || false,
            gpsTrackingInterval: settings.gpsTrackingInterval || 30,
            updatedAt: settings.updatedAt || new Date().toISOString()
        };
    },

    async updateGpsSettings(walkerId, gpsData) {
        if (!walkerId) {
            throw new Error("ID de paseador requerido");
        }

        if (!gpsData || Object.keys(gpsData).length === 0) {
            throw new Error("Datos de GPS requeridos");
        }

        if (gpsData.gpsTrackingInterval !== undefined) {
            if (gpsData.gpsTrackingInterval < 10 || gpsData.gpsTrackingInterval > 300) {
                throw new Error("El intervalo debe estar entre 10 y 300 segundos");
            }
        }

        const settings = await SettingDataAccess.updateGpsSettings(walkerId, gpsData);
        
        return {
            walkerId: settings.walkerId,
            location: settings.location || "No disponible",
            pricePerPet: settings.pricePerPet || 0,
            hasGPSTracker: settings.hasGPSTracker || false,
            hasDiscount: settings.hasDiscount || false,
            discountPercentage: settings.discountPercentage || 0,
            hasMercadoPago: settings.hasMercadoPago || false,
            tokenMercadoPago: settings.tokenMercadoPago || null,
            gpsTrackingEnabled: settings.gpsTrackingEnabled || false,
            gpsTrackingInterval: settings.gpsTrackingInterval || 30,
            updatedAt: settings.updatedAt || new Date().toISOString()
        };
    },

    async toggleGpsTracking(walkerId) {
        if (!walkerId) {
            throw new Error("ID de paseador requerido");
        }

        const settings = await SettingDataAccess.toggleGpsTracking(walkerId);
        
        return {
            walkerId: settings.walkerId,
            location: settings.location || "No disponible",
            pricePerPet: settings.pricePerPet || 0,
            hasGPSTracker: settings.hasGPSTracker || false,
            hasDiscount: settings.hasDiscount || false,
            discountPercentage: settings.discountPercentage || 0,
            hasMercadoPago: settings.hasMercadoPago || false,
            tokenMercadoPago: settings.tokenMercadoPago || null,
            gpsTrackingEnabled: settings.gpsTrackingEnabled || false,
            gpsTrackingInterval: settings.gpsTrackingInterval || 30,
            updatedAt: settings.updatedAt || new Date().toISOString()
        };
    }
};