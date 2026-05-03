import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { store } from '@/store/store';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';


const API_URL =
  // prefer manifest extra (app.config.js / app.json -> extra)
  (Constants.manifest as any)?.extra?.BOOKME_BACK_END_URL ||
  // fallback to env at build time
  (process.env.BOOKME_BACK_END_URL as string | undefined) ||
  'http://192.168.1.108:8000';

console.log("TESTE DE CONEXÃO - URL ATUAL:", API_URL);


// Função para configurar os logs de erro detalhados
const setupInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      // Log para sabermos exatamente onde o App está tentando bater
      console.log(` Chamando: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (res: AxiosResponse) => res,
    (error) => {
      // Esse log vai nos dizer se foi Timeout, Recusado ou 404
      if (error.response) {
        console.log("Erro na resposta do Servidor:", error.response.status, error.response.data);
      } else if (error.request) {
        console.log("O sinal saiu, mas o Servidor não respondeu (Network Error). Verifique o Firewall/IP.");
        console.log("Detalhes técnicos:", error.toJSON().message);
      } else {
        console.log("Erro ao configurar a requisição:", error.message);
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

  // insere token de access vindo do Redux (persistido ou não)
  instance.interceptors.request.use(
    (config: any) => {
      const state = store.getState();
      const token = state.auth?.token;
      config.headers = config.headers ?? {};
      if (token) config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // lógica de refresh usando SecureStore para o refreshToken
  let isRefreshing = false;
  let failedQueue: Array<{ resolve: (value?: any) => void; reject: (err: any) => void }> = [];

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
    failedQueue = [];
  };

  const refreshClient = axios.create({ baseURL: API_URL });

  const performRefresh = async (): Promise<string> => {
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }
    isRefreshing = true;
    try {
      console.log('[api] tentando ler refreshToken do SecureStore');
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) {
        console.log('[api] nenhum refreshToken encontrado no SecureStore');
        throw new Error('No refresh token');
      }
      console.log('[api] refreshToken encontrado (não será logado)');

      const resp = await refreshClient.post('/auth/refresh', { refreshToken });
      const newAccessToken = resp.data.accessToken;
      const newRefreshToken = resp.data.refreshToken;

      // atualiza Redux com novo access token
      try {
        store.dispatch({ type: 'auth/setToken', payload: newAccessToken });
        if (newRefreshToken) {
          await SecureStore.setItemAsync('refreshToken', newRefreshToken);
          console.log('[api] refreshToken atualizado no SecureStore');
        }
      } catch {
        // adaptar para suas actions/slices
      }

      console.log('[api] refresh de token concluído com sucesso');
      processQueue(null, newAccessToken);
      return newAccessToken;
    } catch (err) {
      processQueue(err, null);
      try { store.dispatch({ type: 'auth/logout' }); } catch {}
      throw err;
    } finally {
      isRefreshing = false;
    }
  };

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newToken = await performRefresh();
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axios(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );

  setupInterceptors(instance);
  return instance;
}

export const publicApi = createPublicApi();
export const api = createApi();

export default {
  publicApi,
  api,
};