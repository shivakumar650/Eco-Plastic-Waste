import api from './api';

export const userService = {
  getBookmarks: async () => {
    const response = await api.get('/users/bookmarks');
    return { data: response.data.data };
  },

  addBookmark: async (bookmarkData) => {
    const response = await api.post('/users/bookmarks', bookmarkData);
    return response.data;
  },

  removeBookmark: async (bookmarkData) => {
    const response = await api.delete('/users/bookmarks', { data: bookmarkData });
    return response.data;
  },

  getActivityHistory: async (params = {}) => {
    const response = await api.get('/users/activity', { params });
    return { data: response.data.data };
  },

  clearActivityHistory: async () => {
    const response = await api.delete('/users/activity');
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data.data;
  },

  getJoinedCampaigns: async () => {
    const response = await api.get('/users/campaigns/joined');
    return response.data.data;
  },

  updatePreferences: async (preferences) => {
    const response = await api.put('/users/preferences', { preferences });
    return response.data.data;
  },
};
