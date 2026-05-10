import { apiClient } from './apiClient';

/**
 * Service for article related API calls
 */
export const articleService = {
  /**
   * Search articles by name and category
   */
  searchArticles: async ({ name, page = 1, limit = 10, category = "" }) => {
    const categoryQuery = category ? `&category=${category}` : "";
    return apiClient.get(`/app/v2/search?name=${name}&page=${page}&limit=${limit}${categoryQuery}`);
  },

  /**
   * Get daily articles
   */
  getDailyArticles: async ({ limit = 4, page = 1 } = {}) => {
    const query = new URLSearchParams({ limit, page }).toString();
    return apiClient.get(`/app/v2/dailyArticles?${query}`);
  },

  /**
   * Get trending articles
   */
  getTrendingArticles: async ({ limit = 4, page = 1 } = {}) => {
    const query = new URLSearchParams({ limit, page }).toString();
    return apiClient.get(`/app/v2/trendingArticles?${query}`);
  },

  /**
   * Get a single article by title
   */
  getSingleArticle: async (title) => {
    return apiClient.get(`/app/v2/getSingleArticle/${title}`);
  },

  /**
   * Get articles created by the current user
   */
  getMyArticles: async (token) => {
    return apiClient.get(`/app/v2/getMyArticles?token=${token}`);
  },

  /**
   * Get articles created by the current user with pagination and filtering
   */
  getMyArticlesWithPagination: async ({ token, page = 1, limit = 10, category = "" }) => {
    const categoryQuery = category ? `&category=${category}` : "";
    return apiClient.get(`/app/v2/getMyArticles?token=${token}&page=${page}&limit=${limit}${categoryQuery}`);
  },

  /**
   * Delete an article
   */
  deleteArticle: async (id, token) => {
    return apiClient.delete(`/app/v2/deleteArticle/${id}?token=${token}`);
  },
};
