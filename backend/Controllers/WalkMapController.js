import { WalkMapService } from "../Services/WalkMapService.js";

export const WalkMapController = {

    async saveLocation(locationData) {
        try {
            return await WalkMapService.saveLocation(locationData);
        } catch (error) {
            throw error;
        }
    },

    async getWalkRoute(walkId) {
        try {
            return await WalkMapService.getWalkRoute(walkId);
        } catch (error) {
            throw new Error('Error al cargar la ruta del paseo: ' + error.message);
        }
    },

    async getWalkRecords(walkId) {
        try {
            return await WalkMapService.getWalkRecords(walkId);
        } catch (error) {
            throw new Error('Error al cargar registros del paseo: ' + error.message);
        }
    },

    async checkMapAvailability(walkId) {
        try {
            return await WalkMapService.checkMapAvailability(walkId);
        } catch (error) {
            throw new Error('Error al verificar disponibilidad del mapa: ' + error.message);
        }
    },

    isMapVisible(walkStatus) {
        return WalkMapService.validateMapVisible(walkStatus);
    },

    isMapInteractive(walkStatus) {
        return WalkMapService.validateMapInteractive(walkStatus);
    },

    isTrackingVisible(walkStatus) {
        return WalkMapService.validateTrackingVisible(walkStatus);
    },

    getMapStatusMessage(walkStatus) {
        return WalkMapService.getMapStatusMessage(walkStatus);
    },

    getTrackingStatusMessage(walkStatus) {
        return WalkMapService.getTrackingStatusMessage(walkStatus);
    },

    async getChatMessages(walkId) {
        try {
            return await WalkMapService.getChatMessages(walkId);
        } catch (error) {
            throw new Error('Error al cargar los mensajes del chat: ' + error.message);
        }
    },

    async sendMessage(walkId, userId, userType, userName, message) {
        try {
            WalkMapService.validateMessageLength(message);
            
            return await WalkMapService.sendMessage(walkId, userId, userType, userName, message);
        } catch (error) {
            throw new Error('Error al enviar el mensaje: ' + error.message);
        }
    },

    async markMessagesAsRead(walkId, userId) {
        try {
            return await WalkMapService.markMessagesAsRead(walkId, userId);
        } catch (error) {
            throw new Error('Error al marcar mensajes como leídos: ' + error.message);
        }
    },

    async getUnreadCount(userId) {
        try {
            return await WalkMapService.getUnreadCount(userId);
        } catch (error) {
            throw new Error('Error al obtener mensajes no leídos: ' + error.message);
        }
    },

    isChatVisible(walkStatus) {
        return WalkMapService.validateChatVisible(walkStatus);
    },

    canSendMessages(walkStatus) {
        return WalkMapService.validateCanSendMessages(walkStatus);
    },

    getChatStatusMessage(walkStatus) {
        return WalkMapService.getChatStatusMessage(walkStatus);
    },

    async sendOwnerMessage(walkId, userId, userName, message) {
        return await this.sendMessage(walkId, userId, 'owner', userName, message);
    },

    async sendWalkerMessage(walkId, userId, userName, message) {
        return await this.sendMessage(walkId, userId, 'walker', userName, message);
    }
};