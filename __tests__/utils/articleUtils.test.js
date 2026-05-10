import { articleUtils } from '@/utils/articleUtils';
import { userService } from '@/services/userService';
import moment from 'moment';

// Mock userService
jest.mock('@/services/userService');

describe('articleUtils', () => {
  describe('processArticles', () => {
    it('should return an empty array if input is invalid', async () => {
      expect(await articleUtils.processArticles(null)).toEqual([]);
      expect(await articleUtils.processArticles(undefined)).toEqual([]);
      expect(await articleUtils.processArticles({})).toEqual([]);
    });

    it('should format dates and merge creators', async () => {
      const mockArticles = [
        { _id: '1', title: 'A1', createdAt: new Date().toISOString(), createdBy: 'u1' },
        { _id: '2', title: 'A2', createdAt: new Date().toISOString(), createdBy: 'u2' }
      ];

      const mockCreators = [
        { _id: 'u1', username: 'user1' },
        { _id: 'u2', username: 'user2' }
      ];

      userService.getArticlesCreators.mockResolvedValue(mockCreators);

      const result = await articleUtils.processArticles(mockArticles);

      expect(result).toHaveLength(2);
      expect(result[0].formattedDate).toBeDefined();
      expect(result[0].creator).toEqual(mockCreators[0]);
      expect(result[1].creator).toEqual(mockCreators[1]);
    });

    it('should handle missing creators gracefully', async () => {
      const mockArticles = [
        { _id: '1', title: 'A1', createdAt: new Date().toISOString(), createdBy: 'u1' }
      ];

      userService.getArticlesCreators.mockResolvedValue([]);

      const result = await articleUtils.processArticles(mockArticles);

      expect(result[0].creator).toBeUndefined();
    });
  });

  describe('processComments', () => {
    it('should return empty array for invalid input', () => {
      expect(articleUtils.processComments(null, [])).toEqual([]);
    });

    it('should format comment dates and merge commenters', () => {
      const mockComments = [
        { _id: 'c1', commenterID: 'u1', commentedAt: new Date().toISOString(), commentBody: 'hi' }
      ];
      const mockCommenters = [
        { _id: 'u1', username: 'user1', avatar: 'http://image.com/img.png' }
      ];

      const result = articleUtils.processComments(mockComments, mockCommenters);

      expect(result[0].commenterName).toBe('user1');
      expect(result[0].commenterImage).toBe('http://image.com/img.png');
      expect(result[0].timeAgo).toBeDefined();
    });

    it('should handle missing avatar or invalid avatar URL', () => {
      const mockComments = [{ commenterID: 'u1', commentedAt: new Date().toISOString() }];
      const mockCommenters = [{ _id: 'u1', username: 'user1', avatar: 'not-a-url' }];

      const result = articleUtils.processComments(mockComments, mockCommenters);

      expect(result[0].commenterImage).toBeUndefined();
    });
  });
});
