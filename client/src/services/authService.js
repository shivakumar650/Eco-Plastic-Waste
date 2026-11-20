import api from './api';

const storeAuthSession = ({ user, accessToken, refreshToken }) => {
  if (!user || !accessToken || !refreshToken) {
    throw new Error('Authentication response did not include the user and both tokens');
  }

  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('user', JSON.stringify(user));
};

export const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    storeAuthSession(response.data.data);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    storeAuthSession(response.data.data);
    return response.data;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData);
    
    // Update stored user data
    const updatedUser = response.data.data;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Get stored user data
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await api.post('/auth/refresh-token', { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    
    return response.data;
  }
};