import { articleService } from '@/services/articleService';
import { apiClient } from '@/services/apiClient';

// Mock apiClient
jest.mock('@/services/apiClient');

describe('articleService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('searchArticles calls apiClient.get with correct query', async () => {
    await articleService.searchArticles({ name: 'test', category: 'Tech' });
    expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('name=test&page=1&limit=10&category=Tech'));
  });

  it('getDailyArticles calls apiClient.get with correct limit', async () => {
    await articleService.getDailyArticles({ limit: 5 });
    expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('limit=5&page=1'));
  });

  it('getSingleArticle calls apiClient.get with title', async () => {
    await articleService.getSingleArticle('hello-world');
    expect(apiClient.get).toHaveBeenCalledWith('/app/v2/getSingleArticle/hello-world');
  });

  it('getMyArticlesWithPagination calls apiClient.get with token and params', async () => {
    await articleService.getMyArticlesWithPagination({ token: 'abc', page: 2 });
    expect(apiClient.get).toHaveBeenCalledWith(expect.stringContaining('token=abc&page=2'));
  });

  it('deleteArticle calls apiClient.delete with id and token', async () => {
    await articleService.deleteArticle('123', 'abc');
    expect(apiClient.delete).toHaveBeenCalledWith('/app/v2/deleteArticle/123?token=abc');
  });
});
