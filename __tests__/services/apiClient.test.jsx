import { apiClient } from '@/services/apiClient';

describe('ApiClient', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should make a successful GET request', async () => {
    const mockData = { success: true, data: [] };
    global.fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    });

    const result = await apiClient.get('/test');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({ method: 'GET' })
    );
    expect(result).toEqual(mockData);
  });

  it('should throw an error on non-ok response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: vi.fn().mockResolvedValue({ message: 'Not Found' }),
    });

    await expect(apiClient.get('/not-found')).rejects.toThrow('Not Found');
  });

  it('should handle FormData in POST requests', async () => {
    const formData = new FormData();
    formData.append('file', 'test');
    
    global.fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    });

    await apiClient.post('/upload', formData);

    const [url, config] = global.fetch.mock.calls[0];
    expect(config.body).toBeInstanceOf(FormData);
    expect(config.headers['Content-Type']).toBeUndefined();
  });

  it('should stringify JSON body', async () => {
    const body = { name: 'test' };
    global.fetch.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    });

    await apiClient.post('/test', body);

    const [url, config] = global.fetch.mock.calls[0];
    expect(config.body).toBe(JSON.stringify(body));
    expect(config.headers['Content-Type']).toBe('application/json');
  });
});
