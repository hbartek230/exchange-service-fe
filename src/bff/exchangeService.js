import { bffApiClient, externalApiClient } from './apiClient'
import { EXCHANGE_ENDPOINTS, EXTERNAL_ENDPOINTS } from './exchange'

export const exchangeService = {
  async getExchangeRates() {
    try {
      const response = await bffApiClient.get(EXCHANGE_ENDPOINTS.EXCHANGE_RATES)
      const rawData = response.data || []
      
      // Przekształć dane z BFF do oczekiwanego formatu
      // BFF zwraca tablicę z bid/ask, przekształcamy na currencies
      const currencies = rawData.map(item => ({
        code: item.code,
        name: item.currency,
        rate: parseFloat(item.ask), // Używamy kursu sprzedaży jako głównego kursu
        change: 0, // BFF nie zwraca zmiany, ustawiamy 0
        bid: parseFloat(item.bid),
        ask: parseFloat(item.ask)
      }))
      
      return {
        currencies: currencies,
        cryptocurrencies: [] // BFF na razie nie zwraca kryptowalut
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error)
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Błąd podczas pobierania kursów walut'
      )
    }
  },

  async getMarketStats() {
    try {
      const response = await externalApiClient.get(EXTERNAL_ENDPOINTS.COINGECKO_GLOBAL)
      
      // Walidacja struktury odpowiedzi CoinGecko
      if (!response.data || !response.data.data) {
        console.warn('CoinGecko API returned incomplete data structure')
        return { data: {} } // Zwróć pustą strukturę zamiast błędu
      }
      
      return response.data
    } catch (error) {
      console.error('Error fetching market stats:', error)
      
      // Dla external API nie przerywamy działania aplikacji
      // Zwracamy pustą strukturę, która zostanie zignorowana
      if (error.code === 'ECONNABORTED') {
        console.warn('CoinGecko API timeout - continuing without market stats')
      } else if (!error.response) {
        console.warn('CoinGecko API network error - continuing without market stats')
      } else if (error.response?.status === 429) {
        console.warn('CoinGecko API rate limit exceeded - continuing without market stats')
      }
      
      // Zwracamy pustą strukturę zamiast rzucania błędem
      return { data: {} }
    }
  }
}