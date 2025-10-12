import { WalkMapAPI } from "../API/WalkMapAPI.js";

export const WalkMapDataAccess = {

    async saveLocation(locationData) {
        return await WalkMapAPI.saveLocation(locationData);
    },

    async getWalkRoute(walkId) {
        if (!walkId) {
            throw new Error("El ID del paseo es requerido");
        }
        
        const response = await WalkMapAPI.getWalkRoute(walkId);
        
        if (!response || typeof response.hasMap === 'undefined') {
            throw new Error("Respuesta inválida del servidor");
        }
        
        return response;
    },

    async getWalkRecords(walkId) {
        if (!walkId) {
            throw new Error("El ID del paseo es requerido");
        }
        
        const records = await WalkMapAPI.getWalkRecords(walkId);
        
        if (!Array.isArray(records)) {
            throw new Error("Respuesta inválida del servidor");
        }
        
        return records;
    },

    async checkMapAvailability(walkId) {
        return await WalkMapAPI.checkMapAvailability(walkId);
    },

    async getChatMessages(walkId) {
        if (!walkId) {
            throw new Error("El ID del paseo es requerido");
        }
        
        const response = await WalkMapAPI.getChatMessages(walkId);
        
        if (!response || typeof response.chatId === 'undefined' || !Array.isArray(response.messages)) {
            throw new Error("Respuesta inválida del servidor");
        }
        
        return response;
    },

    async sendMessage(messageData) {
        if (!messageData.walkId || !messageData.message || !messageData.senderId) {
            throw new Error("El ID del paseo, el mensaje y el ID del emisor son requeridos");
        }
        
        const response = await WalkMapAPI.sendMessage(messageData);
        
        if (!response || !response.id) {
            throw new Error("Error al enviar el mensaje");
        }
        
        return response;
    },

    async markMessagesAsRead(walkId, userId) {
        if (!walkId || !userId) {
            throw new Error("El ID del paseo y el ID del usuario son requeridos");
        }
        
        const response = await WalkMapAPI.markMessagesAsRead(walkId, userId);
        
        if (!response || !response.success) {
            throw new Error("Error al marcar mensajes como leídos");
        }
        
        return response;
    },

    async getUnreadCount(userId) {
        if (!userId) {
            throw new Error("El ID del usuario es requerido");
        }
        
        const response = await WalkMapAPI.getUnreadCount(userId);
        
        if (typeof response.unreadCount === 'undefined') {
            throw new Error("Error al obtener contador de mensajes no leídos");
        }
        
        return response.unreadCount;
    }
};