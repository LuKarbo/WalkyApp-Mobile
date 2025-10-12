import { WalkMapDataAccess } from "../DataAccess/WalkMapDataAccess.js";

export const WalkMapService = {

    async saveLocation(locationData) {
        if (!locationData) {
            throw new Error("Datos de ubicación requeridos");
        }

        if (locationData.latitude === undefined || locationData.longitude === undefined) {
            throw new Error("Latitud y longitud son requeridas");
        }

        if (locationData.latitude < -90 || locationData.latitude > 90) {
            throw new Error("Latitud inválida (debe estar entre -90 y 90)");
        }

        if (locationData.longitude < -180 || locationData.longitude > 180) {
            throw new Error("Longitud inválida (debe estar entre -180 y 180)");
        }

        const result = await WalkMapDataAccess.saveLocation(locationData);
        
        return {
            savedCount: result.savedCount || 0,
            locations: result.locations || [],
            message: result.message || "Ubicación guardada"
        };
    },

    async getWalkRoute(walkId) {
        if (!walkId) {
            throw new Error("ID de paseo requerido");
        }

        const route = await WalkMapDataAccess.getWalkRoute(walkId);
        
        return {
            hasMap: route.hasMap || false,
            mapId: route.mapId || null,
            walkId: route.walkId,
            locations: route.locations || []
        };
    },

    async checkMapAvailability(walkId) {
        if (!walkId) {
            throw new Error("ID de paseo requerido");
        }

        const availability = await WalkMapDataAccess.checkMapAvailability(walkId);
        
        return {
            hasMap: availability.hasMap || false,
            mapId: availability.mapId || null,
            locationCount: availability.locationCount || 0
        };
    }
};