import apiClient from '../config/ApiClient.js';

export const WalkMapAPI = {

    async saveLocation(locationData) {
        try {
            const response = await apiClient.post('/walk-maps/location', {
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                altitude: locationData.altitude,
                accuracy: locationData.accuracy,
                timestamp: locationData.timestamp
            });
            
            return {
                savedCount: response.data.data.savedCount,
                locations: response.data.data.locations,
                message: response.data.message
            };
        } catch (error) {
            console.error("Error guardando ubicación GPS:", error);
            throw new Error(error.response?.data?.message || "Error al guardar ubicación");
        }
    },

    async getWalkRoute(walkId) {
        try {
            const response = await apiClient.get(`/walk-maps/walks/${walkId}/route`);
            
            return {
                hasMap: response.data.data.hasMap,
                mapId: response.data.data.mapId,
                walkId: response.data.data.walkId,
                locations: response.data.data.locations
            };
        } catch (error) {
            console.error("Error obteniendo ruta del paseo:", error);
            throw new Error(error.response?.data?.message || "Error al obtener ruta");
        }
    },

    async checkMapAvailability(walkId) {
        try {
            const response = await apiClient.get(`/walk-maps/walks/${walkId}/availability`);
            
            return {
                hasMap: response.data.data.hasMap,
                mapId: response.data.data.mapId,
                locationCount: response.data.data.locationCount
            };
        } catch (error) {
            console.error("Error verificando disponibilidad del mapa:", error);
            throw new Error(error.response?.data?.message || "Error al verificar mapa");
        }
    }
};