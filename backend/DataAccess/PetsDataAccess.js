import { PetsAPI } from "../API/PetsAPI.js";

export const PetsDataAccess = {
    async getAllPets() {
        return await PetsAPI.getAllPets();
    },

    async getPetById(id) {
        return await PetsAPI.getPetById(id);
    },

    async getPetsByOwner(ownerId) {
        return await PetsAPI.getPetsByOwner(ownerId);
    },

    async createPet(petData) {
        return await PetsAPI.createPet(petData);
    },

    async updatePet(id, petData) {
        return await PetsAPI.updatePet(id, petData);
    },
};