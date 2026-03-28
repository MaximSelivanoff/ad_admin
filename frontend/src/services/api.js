import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE
});

// Добавляем token к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  logout: () =>
    api.post('/auth/logout'),
  resetPassword: (userId, oldPassword, newPassword, confirmPassword) =>
    api.post('/auth/reset-password', { userId, oldPassword, newPassword, confirmPassword })
};

// Users API
export const usersAPI = {
  getAll: (page = 1, limit = 20, filters = {}) =>
    api.get('/users', { params: { page, limit, ...filters } }),
  getById: (id) =>
    api.get(`/users/${id}`),
  create: (data) =>
    api.post('/users', data),
  update: (id, data) =>
    api.put(`/users/${id}`, data),
  delete: (id) =>
    api.delete(`/users/${id}`),
  bulkUpdate: (ids, status) =>
    api.patch('/users/bulk', { ids, status })
};

// References API
export const referencesAPI = {
  // Departments
  getDepartments: () =>
    api.get('/references/departments'),
  createDepartment: (data) =>
    api.post('/references/departments', data),
  updateDepartment: (id, data) =>
    api.put(`/references/departments/${id}`, data),
  deleteDepartment: (id) =>
    api.delete(`/references/departments/${id}`),

  // Locations
  getLocations: () =>
    api.get('/references/locations'),
  createLocation: (data) =>
    api.post('/references/locations', data),
  updateLocation: (id, data) =>
    api.put(`/references/locations/${id}`, data),
  deleteLocation: (id) =>
    api.delete(`/references/locations/${id}`),

  // Roles
  getRoles: () =>
    api.get('/references/roles'),
  createRole: (data) =>
    api.post('/references/roles', data),
  updateRole: (id, data) =>
    api.put(`/references/roles/${id}`, data),
  deleteRole: (id) =>
    api.delete(`/references/roles/${id}`)
};

export const metricsAPI = {
  get: () => api.get('/metrics')
};

export const auditAPI = {
  get: (params) => api.get('/audit', { params })
};

export default api;
