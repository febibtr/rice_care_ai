import api from './api';

export const getAllDiseases = async () => {
  const { data } = await api.get('/diseases');
  return data.data.diseases;
};

export const getDiseaseByKey = async (key) => {
  const { data } = await api.get(`/diseases/${key}`);
  return data.data.disease;
};
