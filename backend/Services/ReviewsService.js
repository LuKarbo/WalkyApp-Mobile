import { ReviewsDataAccess } from "../DataAccess/ReviewsDataAccess.js";

export const ReviewsService = {
    async getReviewsByUser(userId, page = 1, limit = 6, searchTerm = "") {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const reviews = await ReviewsDataAccess.getReviewsByUser(userId);
        
        // Filtrar por término de búsqueda
        let filteredReviews = reviews;
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredReviews = reviews.filter(review => 
                review.walkerName.toLowerCase().includes(searchLower) ||
                review.content.toLowerCase().includes(searchLower) ||
                review.petName.toLowerCase().includes(searchLower)
            );
        }

        // Ordenar por fecha (más recientes primero)
        filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Aplicar paginación
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

        // Mapear a DTO
        const reviewsDTO = paginatedReviews.map(review => ({
            id: review.id,
            walkerName: review.walkerName,
            walkerImage: review.walkerImage,
            rating: review.rating,
            content: review.content,
            date: review.date,
            petName: review.petName,
            walkId: review.walkId
        }));

        return {
            reviews: reviewsDTO,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(filteredReviews.length / limit),
                totalItems: filteredReviews.length,
                hasNext: endIndex < filteredReviews.length,
                hasPrev: page > 1
            }
        };
    },

    async getReviewsByWalker(walkerId, page = 1, limit = 6, searchTerm = "") {
        if (!walkerId) {
            throw new Error("Walker ID is required");
        }

        const reviews = await ReviewsDataAccess.getReviewsByWalker(walkerId);
        
        let filteredReviews = reviews;
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filteredReviews = reviews.filter(review => 
                review.ownerName.toLowerCase().includes(searchLower) ||
                review.content.toLowerCase().includes(searchLower) ||
                review.petName.toLowerCase().includes(searchLower)
            );
        }

        filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

        const reviewsDTO = paginatedReviews.map(review => ({
            id: review.id,
            ownerName: review.ownerName,
            ownerImage: review.ownerImage,
            rating: review.rating,
            content: review.content,
            date: review.date,
            petName: review.petName,
            walkId: review.walkId
        }));

        return {
            reviews: reviewsDTO,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(filteredReviews.length / limit),
                totalItems: filteredReviews.length,
                hasNext: endIndex < filteredReviews.length,
                hasPrev: page > 1
            }
        };
    },

    async getReviewDetails(reviewId) {
        if (!reviewId) {
            throw new Error("Review ID is required");
        }

        const review = await ReviewsDataAccess.getReviewById(reviewId);
        
        if (!review) {
            throw new Error("Review not found");
        }

        return {
            id: review.id,
            walkerName: review.walkerName,
            walkerImage: review.walkerImage,
            rating: review.rating,
            content: review.content,
            date: review.date,
            petName: review.petName,
            walkId: review.walkId
        };
    },

    async updateReview(reviewId, reviewData) {
        if (!reviewId) {
            throw new Error("Review ID is required");
        }

        if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }

        if (!reviewData.content || reviewData.content.trim().length === 0) {
            throw new Error("Review content is required");
        }

        const updatedReview = await ReviewsDataAccess.updateReview(reviewId, {
            rating: parseInt(reviewData.rating),
            content: reviewData.content.trim()
        });

        return {
            id: updatedReview.id,
            walkerName: updatedReview.walkerName,
            walkerImage: updatedReview.walkerImage,
            rating: updatedReview.rating,
            content: updatedReview.content,
            date: updatedReview.date,
            petName: updatedReview.petName,
            walkId: updatedReview.walkId
        };
    },

    async deleteReview(reviewId) {
        if (!reviewId) {
            throw new Error("Review ID is required");
        }

        const result = await ReviewsDataAccess.deleteReview(reviewId);
        return result;
    },

    async createReview(reviewData) {
        if (!reviewData) {
            throw new Error("Review data is required");
        }

        if (!reviewData.walkId) {
            throw new Error("Walk ID is required");
        }

        if (!reviewData.walkerId) {
            throw new Error("Walker ID is required");
        }

        if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }

        if (!reviewData.content || reviewData.content.trim().length === 0) {
            throw new Error("Review content is required");
        }

        const newReview = await ReviewsDataAccess.createReview({
            walkId: reviewData.walkId,
            walkerId: reviewData.walkerId,
            rating: parseInt(reviewData.rating),
            content: reviewData.content.trim()
        });

        return {
            id: newReview.id,
            walkerName: newReview.walkerName,
            walkerImage: newReview.walkerImage,
            rating: newReview.rating,
            content: newReview.content,
            date: newReview.date,
            petName: newReview.petName,
            walkId: newReview.walkId
        };
    },

    async getReviewByWalkId(walkId) {
        if (!walkId) {
            throw new Error("Walk ID is required");
        }

        const review = await ReviewsDataAccess.getReviewByWalkId(walkId);
        
        if (!review) {
            return null;
        }

        return {
            id: review.id,
            walkerName: review.walkerName,
            walkerImage: review.walkerImage,
            rating: review.rating,
            content: review.content,
            date: review.date,
            petName: review.petName,
            walkId: review.walkId
        };
    },

};