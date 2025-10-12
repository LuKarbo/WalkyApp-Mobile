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

        const mapData = await WalkMapDataAccess.getWalkRoute(walkId);
        
        if (!mapData.hasMap || !mapData.locations || mapData.locations.length === 0) {
            return [];
        }
        
        return mapData.locations.map(location => ({
            lat: location.lat,
            lng: location.lng
        }));
    },

    async getWalkRecords(walkId) {
        if (!walkId) {
            throw new Error("ID de paseo requerido");
        }

        const records = await WalkMapDataAccess.getWalkRecords(walkId);
        return records;
    },

    async checkMapAvailability(walkId) {
        if (!walkId) {
            throw new Error("ID de paseo requerido");
        }

        const mapData = await WalkMapDataAccess.getWalkRoute(walkId);
        
        return {
            hasMap: mapData.hasMap || false,
            mapId: mapData.mapId || null,
            locationCount: mapData.locations ? mapData.locations.length : 0
        };
    },

    validateMapVisible(walkStatus) {
        const visibleStatuses = ['activo', 'finalizado'];
        return visibleStatuses.includes(walkStatus?.toLowerCase());
    },

    validateMapInteractive(walkStatus) {
        const interactiveStatuses = ['activo'];
        return interactiveStatuses.includes(walkStatus?.toLowerCase());
    },

    validateTrackingVisible(walkStatus) {
        const visibleStatuses = ['activo', 'finalizado'];
        return visibleStatuses.includes(walkStatus?.toLowerCase());
    },

    getMapStatusMessage(walkStatus) {
        if (!walkStatus) return 'Estado del paseo desconocido';
        
        switch (walkStatus.toLowerCase()) {
            case 'activo':
                return 'Mapa activo - Seguimiento en tiempo real';
            case 'finalizado':
                return 'Mapa del paseo completado - Solo lectura';
            case 'agendado':
                return 'El mapa se mostrará cuando el paseo esté activo';
            case 'solicitado':
                return 'Paseo pendiente de confirmación';
            case 'esperando_pago':
            case 'esperando pago':
                return 'Esperando confirmación de pago';
            case 'rechazado':
                return 'El paseo fue rechazado';
            case 'cancelado':
                return 'El paseo fue cancelado';
            default:
                return 'El mapa se mostrará cuando el paseo esté activo';
        }
    },

    getTrackingStatusMessage(walkStatus) {
        if (!walkStatus) return 'Estado del paseo desconocido';
        
        switch (walkStatus.toLowerCase()) {
            case 'activo':
                return 'Seguimiento en tiempo real';
            case 'finalizado':
                return 'Resumen del paseo completado';
            case 'agendado':
                return 'Los datos de seguimiento aparecerán cuando el paseo esté activo';
            case 'solicitado':
                return 'Paseo pendiente de confirmación';
            case 'esperando_pago':
            case 'esperando pago':
                return 'Esperando confirmación de pago';
            case 'rechazado':
                return 'El paseo fue rechazado';
            case 'cancelado':
                return 'El paseo fue cancelado';
            default:
                return 'Los datos de seguimiento aparecerán cuando el paseo esté activo';
        }
    },

    validateCoordinates(lat, lng) {
        if (typeof lat !== 'number' || typeof lng !== 'number') {
            throw new Error('Las coordenadas deben ser números');
        }
        
        if (lat < -90 || lat > 90) {
            throw new Error('La latitud debe estar entre -90 y 90');
        }
        
        if (lng < -180 || lng > 180) {
            throw new Error('La longitud debe estar entre -180 y 180');
        }
        
        return true;
    },

    async getChatMessages(walkId) {
        if (!walkId) {
            throw new Error("ID de paseo requerido");
        }

        const chatData = await WalkMapDataAccess.getChatMessages(walkId);
        
        if (!chatData || !chatData.messages || chatData.messages.length === 0) {
            return [];
        }
        
        return chatData.messages.map(message => ({
            id: message.id,
            text: message.content,
            sender: message.senderType,
            senderName: message.senderName,
            timestamp: message.sentAt,
            time: new Date(message.sentAt).toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            read: message.isRead
        }));
    },

    async sendMessage(walkId, userId, userType, userName, messageText) {
        if (!messageText.trim()) {
            throw new Error("El mensaje no puede estar vacío");
        }

        this.validateMessageLength(messageText);

        const messageData = {
            walkId: walkId,
            senderId: userId,
            senderType: userType,
            senderName: userName,
            message: messageText.trim()
        };

        const sentMessage = await WalkMapDataAccess.sendMessage(messageData);
        
        return {
            id: sentMessage.id,
            text: sentMessage.content,
            sender: sentMessage.senderType,
            senderName: sentMessage.senderName,
            timestamp: sentMessage.sentAt,
            time: new Date(sentMessage.sentAt).toLocaleTimeString('es-AR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            read: sentMessage.isRead
        };
    },

    async markMessagesAsRead(walkId, userId) {
        if (!walkId || !userId) {
            throw new Error("ID de paseo y usuario requeridos");
        }

        return await WalkMapDataAccess.markMessagesAsRead(walkId, userId);
    },

    async getUnreadCount(userId) {
        if (!userId) {
            throw new Error("ID de usuario requerido");
        }

        return await WalkMapDataAccess.getUnreadCount(userId);
    },

    validateMessageLength(message) {
        const MAX_LENGTH = 500;
        if (message.length > MAX_LENGTH) {
            throw new Error(`Mensaje muy largo. Máximo ${MAX_LENGTH} caracteres permitidos.`);
        }
        return true;
    },

    validateChatVisible(walkStatus) {
        if (!walkStatus) return false;
        
        const visibleStatuses = ['activo', 'finalizado'];
        return visibleStatuses.includes(walkStatus.toLowerCase());
    },

    validateCanSendMessages(walkStatus) {
        if (!walkStatus) return false;
        
        const sendableStatuses = ['activo'];
        return sendableStatuses.includes(walkStatus.toLowerCase());
    },

    getChatStatusMessage(walkStatus) {
        if (!walkStatus) return 'Estado del paseo desconocido';
        
        switch (walkStatus.toLowerCase()) {
            case 'agendado':
                return 'El chat se habilitará cuando el paseo esté activo';
            case 'finalizado':
                return 'El paseo ha finalizado. Solo lectura';
            case 'rechazado':
                return 'El paseo fue rechazado';
            case 'solicitado':
                return 'El paseo está pendiente de confirmación';
            case 'esperando_pago':
            case 'esperando pago':
                return 'El paseo está esperando confirmación de pago';
            case 'activo':
                return 'Chat activo';
            case 'cancelado':
                return 'El paseo fue cancelado';
            default:
                return 'Estado del paseo no reconocido';
        }
    }
};