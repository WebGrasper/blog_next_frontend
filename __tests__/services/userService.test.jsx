import { userService } from '@/services/userService';
import { apiClient } from '@/services/apiClient';

vi.mock('@/services/apiClient');

describe('userService', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('getArticlesCreators calls apiClient.post with creators array', async () => {
    apiClient.post.mockResolvedValue({ creators_data: [] });
    await userService.getArticlesCreators(['1', '2']);
    expect(apiClient.post).toHaveBeenCalledWith('/app/v1/getArticlesCreators', { creators: ['1', '2'] });
  });

  it('getSingleUserDetails calls apiClient.get with creatorID', async () => {
    await userService.getSingleUserDetails('u1');
    expect(apiClient.get).toHaveBeenCalledWith('/app/v1/getSingleUserDetails?creatorID=u1');
  });

  it('updateMyDetails calls apiClient.put with token and data', async () => {
    const data = { bio: 'hello' };
    await userService.updateMyDetails('abc', data);
    expect(apiClient.put).toHaveBeenCalledWith('/app/v1/updateMyDetails?token=abc', data);
  });

  it('updateMyAvatar calls apiClient.put with token and formData', async () => {
    const formData = new FormData();
    await userService.updateMyAvatar('abc', formData);
    expect(apiClient.put).toHaveBeenCalledWith('/app/v1/updateMyAvatar?token=abc', formData);
  });
});
