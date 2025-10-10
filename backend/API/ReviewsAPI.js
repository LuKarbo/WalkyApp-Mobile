import apiClient from '../config/ApiClient.js';

export const ReviewsAPI = {
    async getAllReviews() {
        try {
            const response = await apiClient.get('/reviews');
            return response.data.reviews || [];
        } catch (error) {
            console.error('Error al obtener todas las reseñas:', error);
            throw error;
        }
    },

    async getReviewById(id) {
        try {
            if (!id) {
                throw new Error('ID de reseña requerido');
            }
            
            const response = await apiClient.get(`/reviews/${id}`);
            
            return response.data.review || null;
        } catch (error) {
            console.error(`Error al obtener reseña ${id}:`, error);
            if (error.message && error.message.includes('404')) {
                return null;
            }
            throw error;
        }
    },

    async getReviewByWalkId(walkId) {
        try {
            if (!walkId) {
                throw new Error('ID de paseo requerido');
            }
            
            const response = await apiClient.get(`/reviews/walk/${walkId}`);
            return response.data.review || null;
        } catch (error) {
            console.error(`Error al obtener reseña del paseo ${walkId}:`, error);
            if (error.message && error.message.includes('404')) {
                return null;
            }
            throw error;
        }
    },

    async getReviewsByUser(userId) {
        try {
            if (!userId) {
                throw new Error('ID de usuario requerido');
            }
            
            const response = await apiClient.get(`/reviews/user/${userId}`);
            return response.data.reviews || [];
        } catch (error) {
            console.error(`Error al obtener reseñas del usuario ${userId}:`, error);
            throw error;
        }
    },

    async getReviewsByWalker(walkerId) {
        try {
            if (!walkerId) {
                throw new Error('ID de paseador requerido');
            }
            
            const response = await apiClient.get(`/reviews/walker/${walkerId}`);
            return response.data.reviews || [];
        } catch (error) {
            console.error(`Error al obtener reseñas del paseador ${walkerId}:`, error);
            throw error;
        }
    },

    async createReview(reviewData) {
        try {
            if (!reviewData) {
                throw new Error('Datos de reseña requeridos');
            }

            const { walkId, walkerId, rating, content } = reviewData;

            if (!walkId || !walkerId || !rating || !content) {
                throw new Error('walkId, walkerId, rating y content son requeridos');
            }

            const response = await apiClient.post('/reviews', {
                walkId,
                walkerId,
                rating,
                content
            });
            
            return response.data.review || null;
        } catch (error) {
            console.error('Error al crear reseña:', error);
            throw error;
        }
    },

    async updateReview(id, reviewData) {
        try {
            if (!id) {
                throw new Error('ID de reseña requerido');
            }

            if (!reviewData) {
                throw new Error('Datos de reseña requeridos');
            }

            const response = await apiClient.put(`/reviews/${id}`, reviewData);
            return response.data.review || null;
        } catch (error) {
            console.error(`Error al actualizar reseña ${id}:`, error);
            throw error;
        }
    },

    async deleteReview(id) {
        try {
            if (!id) {
                throw new Error('ID de reseña requerido');
            }
            
            const response = await apiClient.delete(`/reviews/${id}`);
            return response.data || { message: 'Reseña eliminada exitosamente' };
        } catch (error) {
            console.error(`Error al eliminar reseña ${id}:`, error);
            throw error;
        }
    },

    async getReviewStats() {
        try {
            const response = await apiClient.get('/reviews/stats');
            return response.data.stats || null;
        } catch (error) {
            console.error('Error al obtener estadísticas de reseñas:', error);
            throw error;
        }
    },

    async getWalkerReviewStats(walkerId) {
        try {
            if (!walkerId) {
                throw new Error('ID de paseador requerido');
            }
            
            const response = await apiClient.get(`/reviews/walker/${walkerId}/stats`);
            return response.data.stats || null;
        } catch (error) {
            console.error(`Error al obtener estadísticas del paseador ${walkerId}:`, error);
            throw error;
        }
    },

    async validateReview(id) {
        try {
            if (!id) {
                throw new Error('ID de reseña requerido');
            }
            
            const response = await apiClient.get(`/reviews/${id}/validate`);
            return response.data.isValid || false;
        } catch (error) {
            console.error(`Error al validar reseña ${id}:`, error);
            return false;
        }
    }
};