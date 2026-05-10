import moment from "moment";
import { userService } from "@/services/userService";

/**
 * Utility functions for article data processing
 */
export const articleUtils = {
  /**
   * Formats a list of articles by adding human-readable dates and merging creator info
   * @param {Array} articles - Raw articles from API
   * @returns {Promise<Array>} - Processed articles
   */
  processArticles: async (articles) => {
    if (!articles || !Array.isArray(articles)) return [];

    // 1. Format dates
    let processed = articles.map((art) => ({
      ...art,
      formattedDate: moment(art.createdAt).fromNow(),
    }));

    // 2. Fetch and merge creators
    const creatorIds = [...new Set(processed.map((art) => art.createdBy).filter(Boolean))];
    if (creatorIds.length > 0) {
      const creators = await userService.getArticlesCreators(creatorIds);
      processed = processed.map((article) => ({
        ...article,
        creator: creators.find((c) => c._id === article.createdBy),
      }));
    }

    return processed;
  },

  /**
   * Formats a list of comments by adding human-readable dates and merging commenter info
   * @param {Array} comments - Raw comments from API
   * @param {Array} commenters - Commenter details from API
   * @returns {Array} - Processed comments
   */
  processComments: (comments, commenters) => {
    if (!comments || !Array.isArray(comments)) return [];
    
    return comments.map((comment) => {
      const commenter = commenters.find((c) => c._id === comment.commenterID);
      let commenterImage = undefined;
      
      if (
        commenter &&
        typeof commenter.avatar === "string" &&
        commenter.avatar.startsWith("http")
      ) {
        commenterImage = commenter.avatar;
      }

      return {
        ...comment,
        commenterName: commenter?.username,
        commenterImage,
        timeAgo: moment(comment.commentedAt).fromNow(),
      };
    });
  }
};
