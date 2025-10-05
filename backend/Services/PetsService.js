import { PetsDataAccess } from "../DataAccess/PetsDataAccess.js";

export const PetsService = {
    async getPetsByOwner(ownerId) {
        if (!ownerId) {
            throw new Error("Owner ID is required");
        }

        const pets = await PetsDataAccess.getPetsByOwner(ownerId);
        
        return pets.map(pet => ({
            id: pet.id,
            name: pet.name,
            image: pet.image,
            weight: pet.weight,
            age: pet.age,
            description: pet.description
        }));
    },

    async getPetDetails(petId) {
        if (!petId) {
            throw new Error("Pet ID is required");
        }

        const pet = await PetsDataAccess.getPetById(petId);
        
        if (!pet) {
            throw new Error("Pet not found");
        }

        return {
            id: pet.id,
            name: pet.name,
            image: pet.image,
            weight: pet.weight,
            age: pet.age,
            description: pet.description
        };
    },

    async createPet(ownerId, petData) {
        if (!ownerId) {
            throw new Error("Owner ID is required");
        }

        if (!petData.name || !petData.image) {
            throw new Error("Name and image are required");
        }

        const newPet = await PetsDataAccess.createPet({
            ...petData,
            ownerId: ownerId
        });

        return {
            id: newPet.id,
            name: newPet.name,
            image: newPet.image,
            weight: newPet.weight,
            age: newPet.age,
            description: newPet.description
        };
    },

    async updatePet(petId, petData) {
        if (!petId) {
            throw new Error("Pet ID is required");
        }

        const updatedPet = await PetsDataAccess.updatePet(petId, petData);

        return {
            id: updatedPet.id,
            name: updatedPet.name,
            image: updatedPet.image,
            weight: updatedPet.weight,
            age: updatedPet.age,
            description: updatedPet.description
        };
    },

};