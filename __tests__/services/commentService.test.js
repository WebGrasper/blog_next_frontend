import { commentService } from '@/services/commentService';
import { apiClient } from '@/services/apiClient';

jest.mock('@/services/apiClient');

describe('commentService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('getComments calls apiClient.get with articleID', async () => {
    await commentService.getComments('a1');
    expect(apiClient.get).toHaveBeenCalledWith('/app/v2/getComments?articleID=a1');
  });

  it('getCommenters calls apiClient.post with commenterIds', async () => {
    await commentService.getCommenters(['u1', 'u2']);
    expect(apiClient.post).toHaveBeenCalledWith('/app/v1/getCommenters', { commenterIds: ['u1', 'u2'] });
  });

  it('addComment calls apiClient.post with comment data and params', async () => {
    const data = { articleID: 'a1', token: 'abc', commentBody: 'cool' };
    await commentService.addComment(data);
    expect(apiClient.post).toHaveBeenCalledWith(
      expect.stringContaining('articleID=a1&token=abc'),
      { commentBody: 'cool' }
    );
  });

  it('incrementViews calls apiClient.get with articleID', async () => {
    await commentService.incrementViews('a1');
    expect(apiClient.get).toHaveBeenCalledWith('/app/v2/viewsIncrementer?articleID=a1');
  });
});
