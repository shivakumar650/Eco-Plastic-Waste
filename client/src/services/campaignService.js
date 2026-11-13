import api from './api';

export const campaignService = {
  getCampaigns: async (filters = {}) => {
    const response = await api.get('/campaigns', { params: filters });
    return response.data.data;
  },

  getCampaign: async (id) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data.data;
  },

  createCampaign: async (campaignData) => {
    const response = await api.post('/campaigns', campaignData);
    return response.data.data;
  },

  joinCampaign: async (id) => {
    const response = await api.post(`/campaigns/${id}/join`);
    return response.data;
  },

  leaveCampaign: async (id) => {
    const response = await api.post(`/campaigns/${id}/leave`);
    return response.data;
  },
};
