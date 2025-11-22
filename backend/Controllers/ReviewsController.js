import { ReviewsService } from "../Services/ReviewsService.js";

export const ReviewsController = {
    async fetchReviewsByUser(userId, page = 1, limit = 6, searchTerm = "") {
        return await ReviewsService.getReviewsByUser(userId, page, limit, searchTerm);
    },

    async fetchReviewsByWalker(walkerId, page = 1, limit = 6, searchTerm = "") {
        return await ReviewsService.getReviewsByWalker(walkerId, page, limit, searchTerm);
    },

    async fetchReviewDetails(reviewId) {
        return await ReviewsService.getReviewDetails(reviewId);
    },

    async updateReview(reviewId, reviewData) {
        return await ReviewsService.updateReview(reviewId, reviewData);
    },

    async deleteReview(reviewId) {
        return await ReviewsService.deleteReview(reviewId);
    },

    async createReview(reviewData){
        return await ReviewsService.createReview(reviewData);
    },

    async fetchReviewByWalkId(walkId) {
        return await ReviewsService.getReviewByWalkId(walkId);
    },
};