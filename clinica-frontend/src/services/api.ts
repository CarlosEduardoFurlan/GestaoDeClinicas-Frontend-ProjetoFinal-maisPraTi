/**
 * Este arquivo servirá como a base para a configuração do Axios.
 * Ele prepara o terreno para a integração real com o backend (Spring Boot).
 */
import axios from 'axios';

// A URL base seria configurada via variável de ambiente no Vite (.env)
// ex: import.meta.env.VITE_API_URL
const API_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o token de autenticação em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar respostas (ex: 401 Unauthorized -> deslogar usuário)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // localStorage.removeItem('auth_token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
