import { WalksService } from "../Services/WalksService.js";

export const WalksController = {
    async fetchWalksForHome() {
        return await WalksService.getWalksForHome();
    },

    async fetchWalkDetails(id) {
        return await WalksService.getWalkDetails(id);
    },

    async fetchActiveWalks() {
        return await WalksService.getActiveWalks();
    },

    async fetchScheduledWalks() {
        return await WalksService.getScheduledWalks();
    },

    async fetchWalksAwaitingPayment() {
        return await WalksService.getWalksAwaitingPayment();
    },

    async fetchRequestedWalks() {
        return await WalksService.getRequestedWalks();
    },

    async fetchWalksByWalker(walkerId) {
        return await WalksService.getWalksByWalker(walkerId);
    },

    async fetchWalksByOwner(ownerId) {
        return await WalksService.getWalksByOwner(ownerId);
    },

    async createWalkRequest(walkRequestData) {
        return await WalksService.createWalkRequest(walkRequestData);
    },

    async updateWalkStatus(walkId, status) {
        return await WalksService.updateWalkStatus(walkId, status);
    },

    async changeWalkStatus(walkId, newStatus) {
        return await WalksService.changeWalkStatus(walkId, newStatus);
    },

    async acceptWalkRequest(walkId) {
        return await WalksService.changeWalkStatus(walkId, 'Esperando pago');
    },

    async rejectWalkRequest(walkId) {
        return await WalksService.changeWalkStatus(walkId, 'Rechazado');
    },

    async confirmPayment(walkId) {
        return await WalksService.changeWalkStatus(walkId, 'Agendado');
    },

    async startWalk(walkId) {
        return await WalksService.changeWalkStatus(walkId, 'Activo');
    },

    async finishWalk(walkId) {
        return await WalksService.changeWalkStatus(walkId, 'Finalizado');
    }
};