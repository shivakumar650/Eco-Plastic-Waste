import api from './api';

export const agencyService = {
  getAgencies: async (params = {}) => {
    const response = await api.get('/agencies', { params });
    return response.data.data;
  },

  getAgency: async (id) => {
    const response = await api.get(`/agencies/${id}`);
    return response.data.data;
  },

  createAgency: async (agencyData) => {
    const response = await api.post('/agencies', agencyData);
    return response.data.data;
  },

  updateAgency: async (id, agencyData) => {
    const response = await api.put(`/agencies/${id}`, agencyData);
    return response.data.data;
  },

  deleteAgency: async (id) => {
    const response = await api.delete(`/agencies/${id}`);
    return response.data;
  },

  addReview: async (id, reviewData) => {
    const response = await api.post(`/agencies/${id}/review`, reviewData);
    return response.data.data;
  },

  getMyAgencies: async () => {
    const response = await api.get('/agencies/my/agencies');
    return response.data.data;
  },

  getNearbyAgencies: async (params) => {
    const response = await api.get('/agencies/nearby', { params });
    return response.data.data;
  },

  getAgencyTypes: async () => {
    const response = await api.get('/agencies/types');
    return response.data.data;
  },
};
