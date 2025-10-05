// BFF API endpoints for exchange service

export const EXCHANGE_ENDPOINTS = {
  // Exchange rates endpoints
  EXCHANGE_RATES: '/api/exchange-management/exchanges/rates',
  
  // Placeholder dla przyszłych endpointów
  EXCHANGE_HISTORY: '/api/exchange-management/exchanges/history',
  EXCHANGE_CONVERT: '/api/exchange-management/exchanges/convert',
  EXCHANGE_MARKET_DATA: '/api/exchange-management/exchanges/market-data'
}

// External API endpoints (nie BFF)
export const EXTERNAL_ENDPOINTS = {
  COINGECKO_GLOBAL: 'https://api.coingecko.com/api/v3/global'
}