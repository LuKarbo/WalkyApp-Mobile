import { ReviewsAPI } from "../API/ReviewsAPI.js";

export const ReviewsDataAccess = {
    async getAllReviews() {
        return await ReviewsAPI.getAllReviews();
    },

    async getReviewById(id) {
        return await ReviewsAPI.getReviewById(id);
    },

    async getReviewsByUser(userId) {
        return await ReviewsAPI.getReviewsByUser(userId);
    },

    async getReviewsByWalker(walkerId) {
        return await ReviewsAPI.getReviewsByWalker(walkerId);
    },

    async updateReview(id, reviewData) {
        return await ReviewsAPI.updateReview(id, reviewData);
    },

    async deleteReview(id) {
        return await ReviewsAPI.deleteReview(id);
    },

    async createReview(reviewData) {
        return await ReviewsAPI.createReview(reviewData);
    },

    async getReviewByWalkId(walkId) {
        return await ReviewsAPI.getReviewByWalkId(walkId);
    },
};