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

const addInterceptors = (client, apiName) => {
  const requestInterceptor = createRequestInterceptor(apiName)
  const responseInterceptor = createResponseInterceptor(apiName)

  client.interceptors.request.use(
    requestInterceptor.onFulfilled,
    requestInterceptor.onRejected
  )

  client.interceptors.response.use(
    responseInterceptor.onFulfilled,
    responseInterceptor.onRejected
  )
}

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

addInterceptors(bffApiClient, 'BFF API')
addInterceptors(externalApiClient, 'External API')

export { bffApiClient, externalApiClient }