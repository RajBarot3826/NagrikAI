import axios from 'axios';

const api = axios.create({
  baseURL: 'https://nagrikai-backend.loca.lt/api',
});

export const getIssues = async (filters) => {
  const response = await api.get('/issues', { params: filters });
  return response.data;
};

export const getIssue = async (id) => {
  const response = await api.get(`/issues/${id}`);
  return response.data;
};

export const createReport = async (reportData) => {
  const response = await api.post('/reports', reportData);
  return response.data;
};

export const updateIssueStatus = async (id, status) => {
  const response = await api.patch(`/issues/${id}`, { status });
  return response.data;
};

export const analyzeImage = async (base64Image) => {
  const response = await api.post('/analyze', { image_base64: base64Image });
  return response.data;
};

export const analyzeVoice = async (transcript) => {
  const response = await api.post('/analyze-voice', { transcript });
  return response.data;
};

export const getDashboardData = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

export default api;
