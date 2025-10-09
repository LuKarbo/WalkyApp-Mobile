import { WalkerDataAccess } from "../DataAccess/WalkerDataAccess.js";

export const WalkerService = {
    async getWalkersForHome() {
        try {
            const walkers = await WalkerDataAccess.getAllWalkers();

            const realWalkers = walkers.filter(walker => !walker.isPlaceholder);

            const walkersDTO = realWalkers.map(walker => ({
                ...walker
            }));

            const topWalkers = walkersDTO.sort((a, b) => b.rating - a.rating).slice(0, 5);

            const walkerPlaceholder = {
                id: 6,
                isPlaceholder: true,
                title: "¿Eres paseador?",
                subtitle: "¡Únete a nosotros!",
                description: "Esperamos tu gran servicio para completar nuestro equipo",
                image: "https://images.unsplash.com/photo-1560807707-8cc77767d783"
            };

            return [...topWalkers, walkerPlaceholder];
        } catch (error) {
            console.error('Service - Error al obtener paseadores para home:', error);
            
            return [{
                id: 6,
                isPlaceholder: true,
                title: "¿Eres paseador?",
                subtitle: "¡Únete a nosotros!",
                description: "Esperamos tu gran servicio para completar nuestro equipo",
                image: "https://images.unsplash.com/photo-1560807707-8cc77767d783"
            }];
        }
    },

    async getAllWalkers() {
        try {
            const walkers = await WalkerDataAccess.getAllWalkers();

            const realWalkers = walkers.filter(walker => !walker.isPlaceholder);

            const walkersDTO = realWalkers.map(walker => ({
                ...walker
            }));

            return [...walkersDTO];
        } catch (error) {
            console.error('Service - Error al obtener paseadores para home:', error);
            
            return [];
        }
    },

    async getWalkerProfile(id) {
        try {
            const walker = await WalkerDataAccess.getWalkerById(id);
            
            if (!walker) {
                throw new Error("Walker not found");
            }

            const walkerProfileDTO = {
                ...walker
            };

            return walkerProfileDTO;
        } catch (error) {
            console.error(`Service - Error al obtener perfil del paseador ${id}:`, error);
            throw error;
        }
    },

    async getWalkerSettings(walkerId) {
        if (!walkerId) {
            throw new Error("Walker ID is required");
        }

        const walkerSettings = await WalkerDataAccess.getWalkerSettings(walkerId);
        
        return {
            location: walkerSettings.location || "",
            pricePerPet: walkerSettings.pricePerPet || 0,
            hasGPSTracker: walkerSettings.hasGPSTracker || false,
            hasDiscount: walkerSettings.hasDiscount || false,
            discountPercentage: walkerSettings.discountPercentage || 0,
            hasMercadoPago: walkerSettings.hasMercadoPago || false,
            tokenMercadoPago: walkerSettings.tokenMercadoPago || null
        };
    },

    async updateWalkerSettings(walkerId, settings) {
        if (!walkerId) {
            throw new Error("Walker ID is required");
        }

        if (!settings) {
            throw new Error("Settings data is required");
        }

        if (settings.pricePerPet !== undefined && settings.pricePerPet < 0) {
            throw new Error("Price per pet cannot be negative");
        }

        if (settings.discountPercentage !== undefined && 
            (settings.discountPercentage < 0 || settings.discountPercentage > 100)) {
            throw new Error("Discount percentage must be between 0 and 100");
        }

        if (settings.hasDiscount === false) {
            settings.discountPercentage = 0;
        }

        if (settings.hasMercadoPago === false) {
            settings.tokenMercadoPago = null;
        }

        const updatedSettings = await WalkerDataAccess.updateWalkerSettings(walkerId, settings);
        
        return {
            location: updatedSettings.location,
            pricePerPet: updatedSettings.pricePerPet,
            hasGPSTracker: updatedSettings.hasGPSTracker,
            hasDiscount: updatedSettings.hasDiscount,
            discountPercentage: updatedSettings.discountPercentage,
            hasMercadoPago: updatedSettings.hasMercadoPago,
            tokenMercadoPago: updatedSettings.tokenMercadoPago,
            updatedAt: updatedSettings.updatedAt
        };
    },

    async updateWalkerMercadoPago(walkerId, mercadoPagoData) {
        
        if (!walkerId) {
            throw new Error("Walker ID is required");
        }

        if (!mercadoPagoData) {
            throw new Error("MercadoPago data is required");
        }

        const { hasMercadoPago, tokenMercadoPago } = mercadoPagoData;

        if (hasMercadoPago && (!tokenMercadoPago || tokenMercadoPago.trim() === '')) {
            throw new Error("Token de MercadoPago es requerido cuando está habilitado");
        }

        const settingsToUpdate = {
            hasMercadoPago, 
            tokenMercadoPago: hasMercadoPago ? tokenMercadoPago : null
        };

        const updatedSettings = await WalkerDataAccess.updateWalkerMercadoPago(walkerId, settingsToUpdate);

        return {
            hasMercadoPago: updatedSettings.hasMercadoPago,
            tokenMercadoPago: updatedSettings.tokenMercadoPago,
            updatedAt: updatedSettings.updatedAt
        };
    },

    async updateWalkerLocation(walkerId, location) {
        if (!walkerId) {
            throw new Error("Walker ID is required");
        }

        if (!location || location.trim() === '') {
            throw new Error("Location is required");
        }

        const updatedSettings = await WalkerDataAccess.updateWalkerSettings(walkerId, { 
            location: location.trim() 
        });
        
        return {
            location: updatedSettings.location,
            updatedAt: updatedSettings.updatedAt
        };
    },

    async updateWalkerPricing(walkerId, pricingData) {
        if (!walkerId) {
            throw new Error("Walker ID is required");
        }

        if (!pricingData) {
            throw new Error("Pricing data is required");
        }

        const { pricePerPet, hasDiscount, discountPercentage } = pricingData;

        if (pricePerPet !== undefined && pricePerPet < 0) {
            throw new Error("Price per pet cannot be negative");
        }

        if (discountPercentage !== undefined && 
            (discountPercentage < 0 || discountPercentage > 100)) {
            throw new Error("Discount percentage must be between 0 and 100");
        }

        const settingsToUpdate = {
            pricePerPet,
            hasDiscount,
            discountPercentage: hasDiscount ? discountPercentage : 0
        };

        const updatedSettings = await WalkerDataAccess.updateWalkerSettings(walkerId, settingsToUpdate);
        
        return {
            pricePerPet: updatedSettings.pricePerPet,
            hasDiscount: updatedSettings.hasDiscount,
            discountPercentage: updatedSettings.discountPercentage,
            updatedAt: updatedSettings.updatedAt
        };
    },

    async validateWalkerSettings(settings) {
        const errors = [];

        if (settings.pricePerPet !== undefined && settings.pricePerPet < 0) {
            errors.push("El precio por mascota no puede ser negativo");
        }

        if (settings.discountPercentage !== undefined) {
            if (settings.discountPercentage < 0 || settings.discountPercentage > 100) {
                errors.push("El porcentaje de descuento debe estar entre 0 y 100");
            }
        }

        if (settings.hasDiscount && (!settings.discountPercentage || settings.discountPercentage <= 0)) {
            errors.push("Debe especificar un porcentaje de descuento válido");
        }

        if (settings.location !== undefined && settings.location.trim() === '') {
            errors.push("La ubicación no puede estar vacía");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    async calculateWalkerEarnings(walkerId) {
    try {
        if (!walkerId) {
            return {
                monthly: 0,
                total: 0,
                completedWalks: 0
            };
        }

        const earnings = await WalkerDataAccess.getWalkerEarnings(walkerId);
        
        return {
            monthly: earnings.monthly,
            total: earnings.total,
            completedWalks: earnings.completedWalks
        };
    } catch (error) {
        console.error(`Service - Error al calcular ganancias del paseador ${walkerId}:`, error);
        
        return {
            monthly: 0,
            total: 0,
            completedWalks: 0
        };
    }
}
};