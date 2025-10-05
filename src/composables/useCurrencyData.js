import { ref, computed } from 'vue'
import { exchangeService } from '../bff/exchangeService'

export function useCurrencyData() {
  // Lokalne dane o flagach - używane tylko jako fallback jeśli BFF nie zwróci flag
  const currencyFlags = {
    'USD': { flag: '🇺🇸', name: 'Dolar amerykański' },
    'EUR': { flag: '🇪🇺', name: 'Euro' },
    'GBP': { flag: '��', name: 'Funt brytyjski' },
    'CHF': { flag: '��', name: 'Frank szwajcarski' },
    'JPY': { flag: '��', name: 'Jen japoński' },
    'CAD': { flag: '��', name: 'Dolar kanadyjski' },
    'AUD': { flag: '��', name: 'Dolar australijski' },
    'CNY': { flag: '��', name: 'Juan chiński' },
    'SEK': { flag: '��', name: 'Korona szwedzka' },
    'NOK': { flag: '��', name: 'Korona norweska' }
  }

  const cryptocurrencyData = {
    'BTC': { symbol: '₿', name: 'Bitcoin', icon: 'mdi-bitcoin' },
    'ETH': { symbol: 'Ξ', name: 'Ethereum', icon: 'mdi-ethereum' },
    'USDT': { symbol: '₮', name: 'Tether', icon: 'mdi-currency-usd' },
    'BNB': { symbol: 'BNB', name: 'Binance Coin', icon: 'mdi-hexagon-multiple' },
    'SOL': { symbol: 'SOL', name: 'Solana', icon: 'mdi-triangle' },
    'XRP': { symbol: 'XRP', name: 'Ripple', icon: 'mdi-water' },
    'ADA': { symbol: '₳', name: 'Cardano', icon: 'mdi-alpha-a-circle' },
    'DOGE': { symbol: 'Ð', name: 'Dogecoin', icon: 'mdi-dog' },
    'DOT': { symbol: 'DOT', name: 'Polkadot', icon: 'mdi-circle-multiple' },
    'MATIC': { symbol: 'MATIC', name: 'Polygon', icon: 'mdi-hexagon' }
  }

  const currencies = ref([])
  const cryptocurrencies = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchExchangeRates = async () => {
    loading.value = true
    error.value = null
    
    try {
      const data = await exchangeService.getExchangeRates()
      
      // Bezpośrednio używaj danych z BFF z lokalnymi fallbackami
      currencies.value = (data.currencies || []).map(currency => ({
        code: currency.code,
        name: currency.name || currencyFlags[currency.code]?.name || currency.code,
        flag: currency.flag || currencyFlags[currency.code]?.flag || '💱',
        rate: currency.rate,
        change: currency.change || 0,
        // Dodatkowe pola z BFF jeśli są dostępne
        bid: currency.bid || null,
        ask: currency.ask || null
      }))
      
      cryptocurrencies.value = (data.cryptocurrencies || []).map(crypto => ({
        // Używaj danych z BFF jako priorytet, lokalne dane jako fallback
        code: crypto.code,
        name: crypto.name || cryptocurrencyData[crypto.code]?.name || crypto.code,
        symbol: crypto.symbol || cryptocurrencyData[crypto.code]?.symbol || crypto.code,
        icon: crypto.icon || cryptocurrencyData[crypto.code]?.icon || 'mdi-currency-btc',
        rate: crypto.rate,
        change: crypto.change || 0
      }))
      
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
      const usdRate = usdEntry ? usdEntry.rate : null

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
        // Zachowaj poprzednią wartość jeśli była ustawiona
        if (marketStats.value.marketCapPLN === null) {
          marketStats.value.marketCapPLN = null
        }
      }

      if (volumeUSD != null && usdRate != null && !isNaN(volumeUSD) && !isNaN(usdRate)) {
        marketStats.value.volume24hPLN = volumeUSD * usdRate
      } else {
        if (volumeUSD == null) {
          console.warn('Volume 24h USD not available in API response')
        }
        // Zachowaj poprzednią wartość jeśli była ustawiona
        if (marketStats.value.volume24hPLN === null) {
          marketStats.value.volume24hPLN = null
        }
      }

      if (typeof btcDominance === 'number' && !isNaN(btcDominance)) {
        marketStats.value.btcDominance = btcDominance
      } else {
        console.warn('BTC dominance not available or invalid in API response')
        // Zachowaj poprzednią wartość jeśli była ustawiona
        if (marketStats.value.btcDominance === null) {
          marketStats.value.btcDominance = null
        }
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

  const convertCurrency = (amount, fromRate, toRate) => {
    if (!amount || !fromRate || !toRate) return 0
    return (amount * fromRate) / toRate
  }

  const init = async () => {
    if (currencies.value.length === 0 && cryptocurrencies.value.length === 0 && !loading.value) {
      await fetchExchangeRates()
    }
  }

  let refreshInterval = null
  
  const startAutoRefresh = () => {
    if (refreshInterval) return
    
    refreshInterval = setInterval(() => {
      fetchExchangeRates()
    }, 5 * 60 * 1000)
  }
  
  const stopAutoRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  // Proste computed properties dla stanu danych
  const hasData = computed(() => {
    return currencies.value.length > 0 || cryptocurrencies.value.length > 0
  })

  return {
    currencies,
    cryptocurrencies,
    formatCurrency,
    convertCurrency,
    marketStats,
    fetchMarketStats,
    formatLargePLN,
    fetchExchangeRates,
    loading,
    error,
    init,
    startAutoRefresh,
    stopAutoRefresh,
    hasData
  }
}