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

    async getWalkRecords(walkId) {
        try {
            const mapData = await this.getWalkRoute(walkId);
            
            if (!mapData.hasMap || !mapData.locations || mapData.locations.length === 0) {
                return [];
            }

            return mapData.locations.map(location => ({
                id: location.id,
                time: new Date(location.recordedAt).toLocaleTimeString('es-AR', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                timeFull: location.recordedAt,
                address: location.address,
                lat: location.lat,
                lng: location.lng
            }));
        } catch (error) {
            console.error('Error obteniendo registros del paseo:', error);
            throw error;
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
    },

    async getChatMessages(walkId) {
        try {
            const response = await apiClient.get(`/chat/walks/${walkId}/messages`);
            return response.data.data;
        } catch (error) {
            console.error('Error obteniendo mensajes del chat:', error);
            throw error;
        }
    },

    async sendMessage(messageData) {
        try {
            const { walkId, senderId, senderType, senderName, message } = messageData;
            
            const response = await apiClient.post(`/chat/walks/${walkId}/messages`, {
                senderId,
                senderType,
                senderName,
                message
            });
            
            return response.data.data;
        } catch (error) {
            console.error('Error enviando mensaje:', error);
            throw error;
        }
    },

    async markMessagesAsRead(walkId, userId) {
        try {
            const response = await apiClient.put(`/chat/walks/${walkId}/messages/read`, {
                userId
            });
            
            return response.data.data;
        } catch (error) {
            console.error('Error marcando mensajes como leídos:', error);
            throw error;
        }
    },

    async getUnreadCount(userId) {
        try {
            const response = await apiClient.get(`/chat/users/${userId}/unread-count`);
            return response.data.data;
        } catch (error) {
            console.error('Error obteniendo contador de no leídos:', error);
            throw error;
        }
    }
};