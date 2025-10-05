import { ref, computed } from 'vue'
import { exchangeService } from '../bff/exchangeService'

// Configuration constants
const REFRESH_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes
const MARKET_STATS_REFRESH_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

// Lokalne dane o flagach - używane tylko jako fallback jeśli BFF nie zwróci flag
const currencyFlags = {
  'USD': { flag: '🇺🇸', name: 'Dolar amerykański' },
  'EUR': { flag: '🇪🇺', name: 'Euro' },
  'GBP': { flag: '🇬🇧', name: 'Funt brytyjski' },
  'CHF': { flag: '🇨🇭', name: 'Frank szwajcarski' },
  'JPY': { flag: '🇯🇵', name: 'Jen japoński' },
  'CAD': { flag: '🇨🇦', name: 'Dolar kanadyjski' },
  'AUD': { flag: '🇦🇺', name: 'Dolar australijski' },
  'CNY': { flag: '🇨🇳', name: 'Juan chiński' },
  'SEK': { flag: '🇸🇪', name: 'Korona szwedzka' },
  'NOK': { flag: '🇳🇴', name: 'Korona norweska' }
}

// Singleton state - shared across all component instances
const currencies = ref([])
const cryptocurrencies = ref([])
const loading = ref(false)
const error = ref(null)

const fetchExchangeRates = async () => {
    loading.value = true
    error.value = null
    
    try {
      const data = await exchangeService.getExchangeRates()
      
      // Bezpośrednio używaj struktury BFF - tablica obiektów z currency, code, bid, ask
      currencies.value = data.map(item => ({
        code: item.code,
        currency: item.currency, // Zachowaj oryginalne pole z BFF
        bid: parseFloat(item.bid),
        ask: parseFloat(item.ask),
        // Dodaj flage jako jedyną "wzbogacenie" z frontendu  
        flag: currencyFlags[item.code]?.flag || '💱'
      }))
      
      // BFF nie zwraca kryptowalut, więc pusta tablica
      cryptocurrencies.value = []
      
    } catch (err) {
      console.error('Error fetching exchange rates:', err)
      error.value = err.message
      
      // W przypadku błędu, zachowaj poprzednie dane jeśli istnieją
      if (currencies.value.length === 0 && cryptocurrencies.value.length === 0) {
        currencies.value = []
        cryptocurrencies.value = []
      }
    } finally {
      loading.value = false
    }
}

const marketStats = ref({
  marketCapPLN: null,
  volume24hPLN: null,
  btcDominance: null,
  updatedAt: null
})

// Auto-refresh state - shared singleton
let refreshTimeout = null
let isAutoRefreshActive = false

// Market stats auto-refresh state - shared singleton  
let marketStatsTimeout = null
let isMarketStatsAutoRefreshActive = false

const formatLargePLN = (value) => {
    if (value === null || value === undefined) return '—'
    const abs = Math.abs(value)
    const sign = value < 0 ? '-' : ''
    const units = [
      { limit: 1e12, suffix: 'bln' },
      { limit: 1e9, suffix: 'mld' },
      { limit: 1e6, suffix: 'mln' },
      { limit: 1e3, suffix: 'tys.' }
    ]

    for (const u of units) {
      if (abs >= u.limit) {
        return `${sign}${(abs / u.limit).toFixed(1)} ${u.suffix} zł`
      }
    }

    return `${sign}${formatCurrency(value, 2)} zł`
}

const fetchMarketStats = async () => {
    try {
      const json = await exchangeService.getMarketStats()

      // Sprawdź czy otrzymaliśmy prawidłowe dane
      if (!json || !json.data) {
        console.warn('Market stats API returned no data - keeping existing values')
        return
      }

      const marketCapUSD = json?.data?.total_market_cap?.usd ?? null
      const volumeUSD = json?.data?.total_volume?.usd ?? null
      const btcDominance = json?.data?.market_cap_percentage?.btc ?? null

      // Znajdź kurs USD, ale obsłuż przypadek gdy go nie ma
      const usdEntry = currencies.value.find(c => c.code === 'USD')
      const usdRate = usdEntry ? usdEntry.ask : null

      // Aktualizuj tylko te wartości, które są dostępne
      if (marketCapUSD != null && usdRate != null && !isNaN(marketCapUSD) && !isNaN(usdRate)) {
        marketStats.value.marketCapPLN = marketCapUSD * usdRate
      } else {
        if (marketCapUSD == null) {
          console.warn('Market cap USD not available in API response')
        }
        if (usdRate == null) {
          console.warn('USD rate not available - cannot calculate PLN values')
        }
        // Wartość zostanie zachowana (null z inicjalizacji lub poprzednia wartość)
      }

      if (volumeUSD != null && usdRate != null && !isNaN(volumeUSD) && !isNaN(usdRate)) {
        marketStats.value.volume24hPLN = volumeUSD * usdRate
      } else {
        if (volumeUSD == null) {
          console.warn('Volume 24h USD not available in API response')
        }
        // Wartość zostanie zachowana (null z inicjalizacji lub poprzednia wartość)
      }

      if (typeof btcDominance === 'number' && !isNaN(btcDominance)) {
        marketStats.value.btcDominance = btcDominance
      } else {
        console.warn('BTC dominance not available or invalid in API response')
        // Wartość zostanie zachowana (null z inicjalizacji lub poprzednia wartość)
      }

      // Zawsze aktualizuj timestamp jeśli udało się pobrać jakiekolwiek dane
      marketStats.value.updatedAt = new Date().toISOString()
      
    } catch (err) {
      console.error('fetchMarketStats error:', err)
      // W przypadku błędu external API, nie przerywamy działania aplikacji
      // Zachowujemy poprzednie wartości i tylko logujemy błąd
    }
}

const formatCurrency = (value, decimals = 2) => {
    return new Intl.NumberFormat('pl-PL', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value)
}

const init = async () => {
    if (currencies.value.length === 0 && cryptocurrencies.value.length === 0 && !loading.value) {
      await fetchExchangeRates()
    }
}

const scheduleNextRefresh = () => {
    if (!isAutoRefreshActive) return
    
    refreshTimeout = setTimeout(async () => {
      if (!isAutoRefreshActive) return
      
      try {
        await fetchExchangeRates()
      } catch (error) {
        console.error('Auto-refresh failed:', error)
      } finally {
        // Schedule next refresh only after current one completes
        scheduleNextRefresh()
      }
    }, REFRESH_INTERVAL_MS)
}

const startAutoRefresh = () => {
    if (isAutoRefreshActive) return
    
    isAutoRefreshActive = true
    scheduleNextRefresh()
}

const stopAutoRefresh = () => {
    isAutoRefreshActive = false
    if (refreshTimeout) {
      clearTimeout(refreshTimeout)
      refreshTimeout = null
    }
}

// Market stats auto-refresh functions - shared singleton
const scheduleNextMarketStatsRefresh = () => {
    if (!isMarketStatsAutoRefreshActive) return
    
    marketStatsTimeout = setTimeout(async () => {
      if (!isMarketStatsAutoRefreshActive) return
      
      try {
        await fetchMarketStats()
      } catch (error) {
        console.error('Market stats auto-refresh failed:', error)
      } finally {
        // Schedule next refresh only after current one completes
        scheduleNextMarketStatsRefresh()
      }
    }, MARKET_STATS_REFRESH_INTERVAL_MS)
}

const startMarketStatsAutoRefresh = () => {
    if (isMarketStatsAutoRefreshActive) return
    
    isMarketStatsAutoRefreshActive = true
    scheduleNextMarketStatsRefresh()
}

const stopMarketStatsAutoRefresh = () => {
    isMarketStatsAutoRefreshActive = false
    if (marketStatsTimeout) {
      clearTimeout(marketStatsTimeout)
      marketStatsTimeout = null
    }
}

// Computed properties dla stanu danych - shared singleton
const hasData = computed(() => {
    return currencies.value.length > 0 || cryptocurrencies.value.length > 0
})

// Composable function - returns access to singleton state and functions
export function useCurrencyData() {
  return {
    currencies,
    cryptocurrencies,
    formatCurrency,
    marketStats,
    fetchMarketStats,
    formatLargePLN,
    fetchExchangeRates,
    loading,
    error,
    init,
    startAutoRefresh,
    stopAutoRefresh,
    startMarketStatsAutoRefresh,
    stopMarketStatsAutoRefresh,
    hasData
  }
}