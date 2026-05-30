import api from './api';

/**
 * Upload gambar + simpan hasil scan dari AI
 * @param {File} imageFile
 * @param {{ diagnosis, confidence, aiNotes, inferenceTimeMs }} result
 */
export const createScan = async (imageFile, result) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('diagnosis', result.diagnosis);
  formData.append('confidence', JSON.stringify(result.confidence));
  if (result.topConfidence) formData.append('topConfidence', String(result.topConfidence));
  if (result.aiNotes) formData.append('aiNotes', result.aiNotes);
  if (result.inferenceTimeMs) formData.append('inferenceTimeMs', String(result.inferenceTimeMs));

  const { data } = await api.post('/scans', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.scan;
};

/**
 * Ambil riwayat scan milik user yang login
 */
export const getMyScans = async ({ page = 1, limit = 10, diagnosis, order = 'desc' } = {}) => {
  const params = { page, limit, order };
  if (diagnosis) params.diagnosis = diagnosis;
  const { data } = await api.get('/scans', { params });
  return { scans: data.data.scans, meta: data.meta };
};

/**
 * Ambil detail satu scan
 */
export const getScanById = async (id) => {
  const { data } = await api.get(`/scans/${id}`);
  return data.data.scan;
};

/**
 * Hapus scan (soft delete)
 */
export const deleteScan = async (id) => {
  const { data } = await api.delete(`/scans/${id}`);
  return data;
};

/**
 * Statistik ringkasan scan user
 */
export const getScanStats = async () => {
  const { data } = await api.get('/scans/stats/summary');
  return data.data;
};
