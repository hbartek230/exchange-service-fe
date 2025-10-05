import axios from 'axios'

// Conditional logging - only in development
const isDevelopment = import.meta.env.DEV
const log = (...args) => isDevelopment && console.log(...args)
const logError = (...args) => isDevelopment && console.error(...args)

// Reusable interceptor helper functions
const createRequestInterceptor = (apiName) => ({
  onFulfilled: (config) => {
    log(`[${apiName}] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  onRejected: (error) => {
    logError(`[${apiName}] Request error:`, error)
    return Promise.reject(error)
  }
})

const createResponseInterceptor = (apiName) => ({
  onFulfilled: (response) => {
    log(`[${apiName}] Response: ${response.status} ${response.statusText}`)
    return response
  },
  onRejected: (error) => {
    logError(`[${apiName}] Response error:`, error.response?.status, error.response?.statusText)
    return Promise.reject(error)
  }
})

// API clients configuration
const bffApiClient = axios.create({
  baseURL: '/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

const externalApiClient = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Apply interceptors using helper functions
const bffRequestInterceptor = createRequestInterceptor('BFF API')
const bffResponseInterceptor = createResponseInterceptor('BFF API')

bffApiClient.interceptors.request.use(
  bffRequestInterceptor.onFulfilled,
  bffRequestInterceptor.onRejected
)

bffApiClient.interceptors.response.use(
  bffResponseInterceptor.onFulfilled,
  bffResponseInterceptor.onRejected
)

const externalRequestInterceptor = createRequestInterceptor('External API')
const externalResponseInterceptor = createResponseInterceptor('External API')

externalApiClient.interceptors.request.use(
  externalRequestInterceptor.onFulfilled,
  externalRequestInterceptor.onRejected
)

externalApiClient.interceptors.response.use(
  externalResponseInterceptor.onFulfilled,
  externalResponseInterceptor.onRejected
)

export { bffApiClient, externalApiClient }