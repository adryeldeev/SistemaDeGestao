
import axios from 'axios';
import { useAuth } from '../Context/authHelpers.jsx';

/*export const = 'https://backendsistemasalao.onrender.com';*/
export const urlApi = 'http://localhost:8000';

const useApi = () => {
  const { token } = useAuth(); // Obtém o token do contexto

  const api = axios.create({
    baseURL: urlApi,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Interceptor para adicionar o token
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api; // Retorna a instância configurada
};

export default useApi;
