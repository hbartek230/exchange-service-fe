import axios from 'axios'

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

bffApiClient.interceptors.request.use(
  (config) => {
    console.log(`[BFF API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('[BFF API] Request error:', error)
    return Promise.reject(error)
  }
)

bffApiClient.interceptors.response.use(
  (response) => {
    console.log(`[BFF API] Response: ${response.status} ${response.statusText}`)
    return response
  },
  (error) => {
    console.error('[BFF API] Response error:', error.response?.status, error.response?.statusText)
    return Promise.reject(error)
  }
)

externalApiClient.interceptors.request.use(
  (config) => {
    console.log(`[External API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('[External API] Request error:', error)
    return Promise.reject(error)
  }
)

externalApiClient.interceptors.response.use(
  (response) => {
    console.log(`[External API] Response: ${response.status} ${response.statusText}`)
    return response
  },
  (error) => {
    console.error('[External API] Response error:', error.response?.status, error.response?.statusText)
    return Promise.reject(error)
  }
)

export { bffApiClient, externalApiClient }