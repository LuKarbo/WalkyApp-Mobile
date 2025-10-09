import { WalksDataAccess } from "../DataAccess/WalksDataAccess.js";

export const WalksService = {
    async getWalksForHome() {
        try {
            const walks = await WalksDataAccess.getAllWalks();

            const walksDTO = walks.map(walk => ({
                id: walk.id,
                dogName: walk.dogName,
                walker: walk.walkerName,
                startTime: walk.startTime,
                status: walk.status
            }));

            const relevantStatuses = ['Activo', 'Agendado', 'Finalizado', 'Esperando pago'];
            return walksDTO.filter(walk => relevantStatuses.includes(walk.status));
        } catch (error) {
            console.error('Service - Error getting walks for home:', error);
            throw error;
        }
    },

    async getWalkDetails(id) {
        try {
            const walk = await WalksDataAccess.getWalkById(id);
            
            if (!walk) {
                throw new Error("Walk not found");
            }

            const walkDetailsDTO = {
                id: walk.id,
                dogName: walk.dogName,
                walker: {
                    id: walk.walkerId,
                    name: walk.walkerName
                },
                owner: {
                    id: walk.ownerId,
                    name: walk.ownerName
                },
                schedule: {
                    startTime: walk.startTime,
                    actualStartTime: walk.actualStartTime,
                    endTime: walk.endTime,
                    actualEndTime: walk.actualEndTime,
                    duration: walk.duration
                },
                status: walk.status,
                metrics: {
                    distance: walk.distance,
                    duration: walk.duration,
                    totalPrice: walk.totalPrice
                },
                notes: walk.notes || "No notes available",
                adminNotes: walk.adminNotes || null,
                petIds: walk.petIds || [],
                petNames: walk.petNames || walk.dogName,
                createdAt: walk.createdAt,
                updatedAt: walk.updatedAt
            };

            return walkDetailsDTO;
        } catch (error) {
            console.error(`Service - Error getting walk details for ${id}:`, error);
            throw error;
        }
    },

    async getActiveWalks() {
        try {
            const activeWalks = await WalksDataAccess.getWalksByStatus('Activo');
            
            return activeWalks.map(walk => ({
                id: walk.id,
                dogName: walk.dogName,
                walker: walk.walkerName,
                startTime: walk.startTime,
                actualStartTime: walk.actualStartTime,
                status: walk.status,
                duration: walk.duration || 0
            }));
        } catch (error) {
            console.error('Service - Error getting active walks:', error);
            throw error;
        }
    },

    async getScheduledWalks() {
        try {
            const scheduledWalks = await WalksDataAccess.getWalksByStatus('Agendado');
            
            return scheduledWalks.map(walk => ({
                id: walk.id,
                dogName: walk.dogName,
                walker: walk.walkerName,
                scheduledTime: walk.startTime,
                status: walk.status
            }));
        } catch (error) {
            console.error('Service - Error getting scheduled walks:', error);
            throw error;
        }
    },

    async getWalksAwaitingPayment() {
        try {
            const walksAwaitingPayment = await WalksDataAccess.getWalksByStatus('Esperando pago');
            
            return walksAwaitingPayment.map(walk => ({
                id: walk.id,
                dogName: walk.dogName,
                walker: walk.walkerName,
                scheduledTime: walk.startTime,
                status: walk.status,
                totalPrice: walk.totalPrice
            }));
        } catch (error) {
            console.error('Service - Error getting walks awaiting payment:', error);
            throw error;
        }
    },

    async getRequestedWalks() {
        try {
            const requestedWalks = await WalksDataAccess.getWalksByStatus('Solicitado');
            
            return requestedWalks.map(walk => ({
                id: walk.id,
                dogName: walk.dogName,
                walker: walk.walkerName,
                requestedTime: walk.startTime,
                status: walk.status,
                totalPrice: walk.totalPrice
            }));
        } catch (error) {
            console.error('Service - Error getting requested walks:', error);
            throw error;
        }
    },

    async getWalksByWalker(walkerId) {
        try {
            if (!walkerId) {
                throw new Error("Walker ID is required");
            }

            const walks = await WalksDataAccess.getWalksByWalkerId(walkerId);
            
            return walks.map(walk => ({
                id: walk.id,
                dogName: walk.dogName,
                ownerName: walk.ownerName,
                startTime: walk.startTime,
                actualStartTime: walk.actualStartTime,
                endTime: walk.endTime,
                actualEndTime: walk.actualEndTime,
                status: walk.status,
                duration: walk.duration,
                distance: walk.distance,
                totalPrice: walk.totalPrice,
                notes: walk.notes
            }));
        } catch (error) {
            console.error(`Service - Error getting walks for walker ${walkerId}:`, error);
            throw error;
        }
    },

    async getWalksByOwner(ownerId) {
        try {
            if (!ownerId) {
                throw new Error("Owner ID is required");
            }

            const walks = await WalksDataAccess.getWalkByOwner(ownerId);

            if (!walks || walks.length === 0) {
                return [];
            }

            return walks.map(walk => ({
                id: walk.id,
                dogName: walk.dogName,
                walker: walk.walkerName,
                startTime: walk.startTime,
                actualStartTime: walk.actualStartTime,
                endTime: walk.endTime,
                actualEndTime: walk.actualEndTime,
                status: walk.status,
                duration: walk.duration,
                distance: walk.distance,
                totalPrice: walk.totalPrice,
                notes: walk.notes
            }));
        } catch (error) {
            console.error(`Service - Error getting walks for owner ${ownerId}:`, error);
            throw error;
        }
    },

    async createWalkRequest(walkRequestData) {
        try {
            if (!walkRequestData.walkerId) {
                throw new Error("Walker ID is required");
            }
            if (!walkRequestData.ownerId) {
                throw new Error("Owner ID is required");
            }
            if (!walkRequestData.petIds || walkRequestData.petIds.length === 0) {
                throw new Error("At least one pet must be selected");
            }
            if (!walkRequestData.scheduledDateTime) {
                throw new Error("Scheduled date and time is required");
            }
            if (!walkRequestData.totalPrice || walkRequestData.totalPrice <= 0) {
                throw new Error("Total price must be greater than 0");
            }

            const newWalkRequest = await WalksDataAccess.createWalkRequest(walkRequestData);
            
            return {
                id: newWalkRequest.id,
                walkerId: newWalkRequest.walkerId,
                ownerId: newWalkRequest.ownerId,
                petIds: newWalkRequest.petIds,
                scheduledDateTime: newWalkRequest.startTime,
                description: newWalkRequest.notes,
                totalPrice: newWalkRequest.totalPrice,
                status: newWalkRequest.status,
                createdAt: newWalkRequest.createdAt
            };
        } catch (error) {
            console.error('Service - Error creating walk request:', error);
            throw error;
        }
    },

    async updateWalkStatus(walkId, status) {
        try {
            if (!walkId) {
                throw new Error("Walk ID is required");
            }
            if (!status) {
                throw new Error("Status is required");
            }

            const validStatuses = ['Solicitado', 'Esperando pago', 'Agendado', 'Activo', 'Finalizado', 'Rechazado', 'Cancelado'];
            if (!validStatuses.includes(status)) {
                throw new Error("Invalid status. Valid statuses: " + validStatuses.join(', '));
            }

            const updatedWalk = await WalksDataAccess.updateWalkStatus(walkId, status);
            
            return {
                id: updatedWalk.id,
                status: updatedWalk.status,
                updatedAt: updatedWalk.updatedAt
            };
        } catch (error) {
            console.error(`Service - Error updating walk ${walkId} status:`, error);
            throw error;
        }
    },

    async validateStatusTransition(walkId, newStatus) {
        try {
            const walk = await WalksDataAccess.getWalkById(walkId);
            if (!walk) {
                throw new Error("Walk not found");
            }

            const currentStatus = walk.status;
            const validTransitions = {
                'Solicitado': ['Esperando pago', 'Rechazado', 'Cancelado'],
                'Esperando pago': ['Agendado', 'Cancelado'],
                'Agendado': ['Activo', 'Cancelado'],
                'Activo': ['Finalizado'],
                'Finalizado': [],
                'Rechazado': [],
                'Cancelado': []
            };

            if (!validTransitions[currentStatus] || !validTransitions[currentStatus].includes(newStatus)) {
                throw new Error(`Invalid status transition from '${currentStatus}' to '${newStatus}'`);
            }

            return true;
        } catch (error) {
            console.error(`Service - Error validating status transition for walk ${walkId}:`, error);
            throw error;
        }
    },

    async changeWalkStatus(walkId, newStatus) {
        try {
            await this.validateStatusTransition(walkId, newStatus);
            
            let updatedWalk;
            
            switch(newStatus) {
                case 'Esperando pago':
                    updatedWalk = await WalksDataAccess.acceptWalkRequest(walkId);
                    break;
                    
                case 'Rechazado':
                    updatedWalk = await WalksDataAccess.rejectWalkRequest(walkId);
                    break;
                    
                case 'Agendado':
                    updatedWalk = await WalksDataAccess.confirmPayment(walkId);
                    break;
                    
                case 'Activo':
                    updatedWalk = await WalksDataAccess.startWalk(walkId);
                    break;
                    
                case 'Finalizado':
                    updatedWalk = await WalksDataAccess.finishWalk(walkId);
                    break;
                    
                case 'Cancelado':
                    updatedWalk = await WalksDataAccess.updateWalkStatus(walkId, newStatus);
                    break;
                    
                default:
                    updatedWalk = await WalksDataAccess.updateWalkStatus(walkId, newStatus);
            }
            
            return {
                id: updatedWalk.id,
                status: updatedWalk.status,
                updatedAt: updatedWalk.updatedAt
            };
        } catch (error) {
            console.error(`Service - Error changing walk ${walkId} status to ${newStatus}:`, error);
            throw error;
        }
    }
};