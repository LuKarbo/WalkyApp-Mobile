import apiClient from '../config/ApiClient.js';

export const WalkerAPI = {
    
    async getAllWalkers() {
        try {
            const response = await apiClient.get('/walkers');
            
            return response.data.walkers || [];
        } catch (error) {
            console.error('Error al obtener paseadores:', error);
            throw new Error('No se pudieron cargar los paseadores');
        }
    },

    async getWalkerById(id) {
        try {
            if (!id) {
                throw new Error('ID de paseador requerido');
            }
            
            const response = await apiClient.get(`/walkers/${id}`);
            return response.data.walker || null;
        } catch (error) {
            console.error(`Error al obtener paseador ${id}:`, error);
            if (error.message.includes('404')) {
                return null;
            }
            throw new Error('No se pudo cargar el paseador');
        }
    },

    async getWalkerSettings(walkerId) {
        try {
            if (!walkerId) {
                throw new Error('ID de paseador requerido');
            }

            const response = await apiClient.get(`/walkers/${walkerId}/settings`);
            return response.data.settings || {
                location: "",
                pricePerPet: 15000,
                hasGPSTracker: false,
                hasDiscount: false,
                discountPercentage: 0,
                hasMercadoPago: false,
                tokenMercadoPago: null
            };
        } catch (error) {
            console.error(`Error al obtener configuraciones del paseador ${walkerId}:`, error);
            
            return {
                location: "",
                pricePerPet: 15000,
                hasGPSTracker: false,
                hasDiscount: false,
                discountPercentage: 0,
                hasMercadoPago: false,
                tokenMercadoPago: null,
                updatedAt: new Date().toISOString()
            };
        }
    },

    async updateWalkerMercadoPago(walkerId, mercadoPagoData) {
        
        try {
            if (!walkerId) {
                throw new Error('ID de paseador requerido');
            }

            if (!mercadoPagoData) {
                throw new Error('Datos de MercadoPago requeridos');
            }

            const { hasMercadoPago, tokenMercadoPago } = mercadoPagoData;

            if (hasMercadoPago && (!tokenMercadoPago || tokenMercadoPago.trim() === '')) {
                throw new Error('Token de MercadoPago es requerido cuando está habilitado');
            }

            const response = await apiClient.patch(`/walkers/${walkerId}/mercadopago`, mercadoPagoData);
            return response.data.settings;
        } catch (error) {
            console.error(`Error al actualizar MercadoPago del paseador ${walkerId}:`, error);
            throw new Error(error.message || 'No se pudo actualizar la configuración de MercadoPago');
        }
    },

    async updateWalkerSettings(walkerId, settings) {
        
        try {
            if (!walkerId) {
                throw new Error('ID de paseador requerido');
            }

            if (!settings || Object.keys(settings).length === 0) {
                throw new Error('Configuraciones requeridas');
            }

            const response = await apiClient.put(`/walkers/${walkerId}/settings`, settings);
            
            return response.data.settings;
        } catch (error) {
            console.error(`Error al actualizar configuraciones del paseador ${walkerId}:`, error);
            throw new Error(error.message || 'No se pudieron actualizar las configuraciones');
        }
    },

    async getWalkerEarningsSettings(walkerId) {
        
        try {
            if (!walkerId) {
                throw new Error('ID de paseador requerido');
            }

            const response = await apiClient.get(`/walkers/${walkerId}/earnings`);
            const earnings = response.data.earnings;
            
            return {
                pricePerPet: earnings.currentPricePerPet || 15000,
                hasDiscount: earnings.hasDiscount || false,
                discountPercentage: earnings.discountPercentage || 0,
                effectivePrice: earnings.hasDiscount ? 
                    earnings.currentPricePerPet * (1 - earnings.discountPercentage / 100) : 
                    earnings.currentPricePerPet
            };
        } catch (error) {
            console.error(`Error al obtener configuraciones de ganancias del paseador ${walkerId}:`, error);
            
            return {
                pricePerPet: 15000,
                hasDiscount: false,
                discountPercentage: 0,
                effectivePrice: 15000
            };
        }
    },

    async updateWalkerLocation(walkerId, location) {
        try {
            if (!walkerId) {
                throw new Error('ID de paseador requerido');
            }

            if (!location || location.trim() === '') {
                throw new Error('Ubicación requerida');
            }

            const response = await apiClient.patch(`/walkers/${walkerId}/location`, { 
                location: location.trim() 
            });
            
            return response.data.settings;
        } catch (error) {
            console.error(`Error al actualizar ubicación del paseador ${walkerId}:`, error);
            throw new Error(error.message || 'No se pudo actualizar la ubicación');
        }
    },

    async updateWalkerPricing(walkerId, pricingData) {
        try {
            if (!walkerId) {
                throw new Error('ID de paseador requerido');
            }

            if (!pricingData) {
                throw new Error('Datos de precios requeridos');
            }

            const { pricePerPet, hasDiscount, discountPercentage } = pricingData;

            // Validaciones del lado del cliente
            if (pricePerPet !== undefined && pricePerPet < 0) {
                throw new Error('El precio por mascota no puede ser negativo');
            }

            if (discountPercentage !== undefined && (discountPercentage < 0 || discountPercentage > 100)) {
                throw new Error('El porcentaje de descuento debe estar entre 0 y 100');
            }

            if (hasDiscount && (!discountPercentage || discountPercentage <= 0)) {
                throw new Error('Debe especificar un porcentaje de descuento válido');
            }

            const response = await apiClient.patch(`/walkers/${walkerId}/pricing`, pricingData);
            
            return response.data.settings;
        } catch (error) {
            console.error(`Error al actualizar precios del paseador ${walkerId}:`, error);
            throw new Error(error.message || 'No se pudieron actualizar los precios');
        }
    },

    // Métodos adicionales útiles
    async searchWalkers(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (filters.query) queryParams.append('query', filters.query);
            if (filters.location) queryParams.append('location', filters.location);
            if (filters.minRating) queryParams.append('minRating', filters.minRating);
            if (filters.limit) queryParams.append('limit', filters.limit);

            const queryString = queryParams.toString();
            const endpoint = queryString ? `/walkers/search?${queryString}` : '/walkers/search';
            
            const response = await apiClient.get(endpoint);
            return response.data.walkers || [];
        } catch (error) {
            console.error('Error al buscar paseadores:', error);
            throw new Error('No se pudieron buscar los paseadores');
        }
    },

    async validateWalker(walkerId) {
        try {
            if (!walkerId) {
                throw new Error('ID de paseador requerido');
            }

            const response = await apiClient.get(`/walkers/${walkerId}/validate`);
            return response.data.isValid || false;
        } catch (error) {
            console.error(`Error al validar paseador ${walkerId}:`, error);
            return false;
        }
    },

    async getWalkerEarnings(walkerId) {
        try {
            if (!walkerId) {
                throw new Error('ID de paseador requerido');
            }
            
            const response = await apiClient.get(`/walkers/${walkerId}/earnings`);
            return response.data.earnings || {
                monthly: 0,
                total: 0,
                completedWalks: 0,
                currentPricePerPet: 15000,
                hasDiscount: false,
                discountPercentage: 0
            };
        } catch (error) {
            console.error(`Error al obtener ganancias del paseador ${walkerId}:`, error);
            
            return {
                monthly: 0,
                total: 0,
                completedWalks: 0,
                currentPricePerPet: 15000,
                hasDiscount: false,
                discountPercentage: 0
            };
        }
    },

};