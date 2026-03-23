import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { store } from '@/store/store';

const API_URL = 'http://192.168.1.108:8000';

console.log("🛠️ TESTE DE CONEXÃO - URL ATUAL:", API_URL);

let _csrfToken: string | null = null;

export function setCsrfToken(token: string) {
  _csrfToken = token;
}

export function clearCsrfToken(token: string) {
  _csrfToken = token;
}

// Função para configurar os logs de erro detalhados
const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      // Log para sabermos exatamente onde o App está tentando bater
      console.log(`🚀 Chamando: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (res: AxiosResponse) => res,
    (error) => {
      // Esse log vai nos dizer se foi Timeout, Recusado ou 404
      if (error.response) {
        console.log("❌ Erro na resposta do Servidor:", error.response.status, error.response.data);
      } else if (error.request) {
        console.log("❌ O sinal saiu, mas o Servidor não respondeu (Network Error). Verifique o Firewall/IP.");
        console.log("Detalhes técnicos:", error.toJSON().message);
      } else {
        console.log("❌ Erro ao configurar a requisição:", error.message);
      }
      return Promise.reject(error);
    }
  );
};

function createPublicApi(): AxiosInstance {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  setupInterceptors(instance);
  return instance;
}

function createApi(): AxiosInstance {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config: any) => {
      const state = store.getState();
      const token = state.auth.token;

      config.headers = config.headers ?? {};
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      if (_csrfToken) {
        config.headers['X-CSRF-Token'] = _csrfToken;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  setupInterceptors(instance);
  return instance;
}

export const publicApi = createPublicApi();
export const api = createApi();

export default {
  publicApi,
  api,
  setCsrfToken,
  clearCsrfToken,
};