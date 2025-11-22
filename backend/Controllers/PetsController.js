import { PetsService } from "../Services/PetsService.js";

export const PetsController = {
    async fetchPetsByOwner(ownerId) {
        return await PetsService.getPetsByOwner(ownerId);
    },

    async fetchPetDetails(petId) {
        return await PetsService.getPetDetails(petId);
    },

    async createPet(ownerId, petData) {
        return await PetsService.createPet(ownerId, petData);
    },

    async updatePet(petId, petData) {
        return await PetsService.updatePet(petId, petData);
    },
};