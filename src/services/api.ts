import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// Base URL (override with environment variable in production)
const BASE_URL = process.env.API_URL || 'http://localhost:3000'

let _csrfToken: string | null = null

/**
 * Use this to set the CSRF token from anywhere (e.g. after login).
 * Replace this with a Redux selector or secure storage when ready.
 */
export function setCsrfToken(token: string) {
  _csrfToken = token
}

export function clearCsrfToken() {
  _csrfToken = null
}

function createPublicApi(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor (public) — useful for logging/headers
  instance.interceptors.request.use(
    (config: any) => {
      // add any default public headers here
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor (public)
  instance.interceptors.response.use(
    (res: AxiosResponse) => res,
    (error) => {
      // normalize or log public errors here
      return Promise.reject(error)
    }
  )

  return instance
}

function createApi(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor (private API) — attach CSRF token or auth
  instance.interceptors.request.use(
    (config: any) => {
      // Inject CSRF token if available
      if (_csrfToken) {
        config.headers = config.headers ?? {}
        // common header name for CSRF — adjust to your backend
        ;(config.headers as Record<string, string>)['X-CSRF-Token'] = _csrfToken
      }

      // TODO: when Redux/auth is available, attach Authorization header here
      // e.g. const token = store.getState().auth.token
      // if (token) config.headers.Authorization = `Bearer ${token}`

      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor (private)
  instance.interceptors.response.use(
    (res: AxiosResponse) => res,
    (error) => {
      // central place to handle 401, refresh token logic, global toast, etc.
      // For now, just rethrow.
      return Promise.reject(error)
    }
  )

  return instance
}

export const publicApi = createPublicApi()
export const api = createApi()

export default {
  publicApi,
  api,
  setCsrfToken,
  clearCsrfToken,
}
