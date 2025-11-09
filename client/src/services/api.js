import axios from 'axios';

// In production (Vercel), API routes are relative
// In development, use localhost:5000
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:5000' : '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Upload and process resume
 * @param {File} file - Resume PDF file
 * @returns {Promise} API response with enhanced resume data and PDF base64
 */
export async function processResume(file) {
  const formData = new FormData();
  formData.append('resume', file);

  const response = await api.post('/api/resume/process', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * Convert base64 PDF to downloadable blob URL
 * @param {string} base64 - Base64 encoded PDF
 * @param {string} filename - Filename for download
 * @returns {string} Blob URL for download
 */
export function createPDFDownloadUrl(base64, filename) {
  // Convert base64 to binary
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Create blob and URL
  const blob = new Blob([bytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}

export default api;
