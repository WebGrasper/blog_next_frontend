import { apiClient } from './apiClient';

/**
 * Service for comment related API calls
 */
export const commentService = {
  /**
   * Get comments for an article
   */
  getComments: async (articleID) => {
    return apiClient.get(`/app/v2/getComments?articleID=${articleID}`);
  },

  /**
   * Get commenter details
   */
  getCommenters: async (commenterIds) => {
    try {
      const response = await apiClient.post('/app/v1/getCommenters', { commenterIds });
      return response?.commenters || [];
    } catch (error) {
      console.error("commentService: Fetch commenters failed:", error);
      return [];
    }
  },

  /**
   * Post a new comment
   */
  addComment: async ({ articleID, token, commentBody }) => {
    return apiClient.post(`/app/v2/addComment?articleID=${articleID}&token=${token}`, { commentBody });
  },

  /**
   * Increment view count for an article
   */
  incrementViews: async (articleID) => {
    return apiClient.get(`/app/v2/viewsIncrementer?articleID=${articleID}`);
  },
};
