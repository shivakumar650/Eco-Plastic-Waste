import api from './api';

const contentPaths = {
  campaign: 'campaigns',
  resource: 'resources',
  agency: 'agencies',
};

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data.data;
  },

  getUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data.data;
  },

  updateUserStatus: async (id, isActive) => {
    const response = await api.put(`/admin/users/${id}/status`, { isActive });
    return response.data.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getPending: async (type) => {
    const response = await api.get(`/admin/${contentPaths[type]}/pending`);
    return response.data.data;
  },

  updateContentStatus: async (type, id, status, adminNotes = '') => {
    const response = await api.put(`/admin/${contentPaths[type]}/${id}/status`, { status, adminNotes });
    return response.data.data;
  },

  getAuditLogs: async (params = {}) => {
    const response = await api.get('/admin/audit-logs', { params });
    return response.data.data;
  },
};