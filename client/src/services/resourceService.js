import api from './api';

export const resourceService = {
  getResources: async (params = {}) => {
    const response = await api.get('/resources', { params });
    return response.data.data;
  },

  getResource: async (id) => {
    const response = await api.get(`/resources/${id}`);
    return response.data.data;
  },

  createResource: async (resourceData) => {
    const response = await api.post('/resources', resourceData);
    return response.data.data;
  },

  updateResource: async (id, resourceData) => {
    const response = await api.put(`/resources/${id}`, resourceData);
    return response.data.data;
  },

  deleteResource: async (id) => {
    const response = await api.delete(`/resources/${id}`);
    return response.data;
  },

  toggleLike: async (id) => {
    const response = await api.post(`/resources/${id}/like`);
    return response.data.data;
  },

  getMyResources: async () => {
    const response = await api.get('/resources/my/resources');
    return response.data.data;
  },

  getPopularResources: async () => {
    const response = await api.get('/resources/popular');
    return response.data.data;
  },

  getCategories: async () => {
    const response = await api.get('/resources/categories');
    return response.data.data;
  },
};
