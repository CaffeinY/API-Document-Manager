import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_BASE_URL}/docs/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getDocuments = async () => {
  const response = await axios.get(`${API_BASE_URL}/docs`);
  return response.data;
};

export const getDocument = async (id: string) => {
  const response = await axios.get(`${API_BASE_URL}/docs/${id}`);
  return response.data;
}; 