import { apiClient } from './apiClient';

/**
 * Service for user/creator related API calls
 */
export const userService = {
  /**
   * Fetch creator data for a list of creator IDs
   */
  getArticlesCreators: async (creators) => {
    try {
      const response = await apiClient.post('/app/v1/getArticlesCreators', { creators });
      return response?.creators_data || [];
    } catch (error) {
      console.error("userService: Fetch creators failed:", error);
      return [];
    }
  },

  /**
   * Fetch details for a single user/creator
   */
  getSingleUserDetails: async (creatorID) => {
    return apiClient.get(`/app/v1/getSingleUserDetails?creatorID=${creatorID}`);
  },

  /**
   * Update user details
   */
  updateMyDetails: async (token, data) => {
    return apiClient.put(`/app/v1/updateMyDetails?token=${token}`, data);
  },

  /**
   * Update user avatar
   */
  updateMyAvatar: async (token, formData) => {
    return apiClient.put(`/app/v1/updateMyAvatar?token=${token}`, formData);
  },
};
