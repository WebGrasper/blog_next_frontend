/**
 * Base API client for WebGrasper
 * Handles fetch requests with common headers and basic error handling
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class ApiClient {
  async request(endpoint, options = {}) {
    const { method = 'GET', headers = {}, body, ...rest } = options;

    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...rest,
    };

    if (body) {
      if (body instanceof FormData) {
        config.body = body;
        // Don't set Content-Type header, fetch will set it with boundary for FormData
        delete config.headers['Content-Type'];
      } else {
        config.body = JSON.stringify(body);
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      if (!response.ok) {
        // You can add more sophisticated error handling here
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`ApiClient Error [${method} ${endpoint}]:`, error.message);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
