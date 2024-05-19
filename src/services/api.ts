import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
});
const getTokens = () => {
  return {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
  };
};
const getFiles = async (filter: string, order: string) => {
  const response = await api.get(`/files?filter=${filter}&order=${order}`, {
    headers: getTokens(),
  });
  return response.data;
};

const getFile = async (name: string) => {
  const response = await api.get(`/files/${name}`, { headers: getTokens() });
  return response.data;
};

const uploadFile = async (name: string, file?: File) => {
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', name);
  const response = await api.post('/files', formData, {
    headers: Object.assign({ 'Content-Type': 'multipart/form-data' }, getTokens()),
  });
  return response.data;
};

const deleteFile = async (name: string) => {
  const response = await api.delete(`/files/${name}`, { headers: getTokens(), params: { name } });
  return response.data;
};
export const server = { getFiles, uploadFile, deleteFile, getFile };
