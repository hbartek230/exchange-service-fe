import { ref } from 'vue'

export function useCurrencyData() {
  const currencies = ref([
    { 
      code: 'USD', 
      name: 'Dolar amerykański', 
      flag: '🇺🇸',
      rate: 4.02,
      change: 0.5
    },
    { 
      code: 'EUR', 
      name: 'Euro', 
      flag: '🇪🇺',
      rate: 4.32,
      change: -0.3
    },
    { 
      code: 'GBP', 
      name: 'Funt brytyjski', 
      flag: '🇬🇧',
      rate: 5.08,
      change: 0.8
    },
    { 
      code: 'CHF', 
      name: 'Frank szwajcarski', 
      flag: '🇨🇭',
      rate: 4.61,
      change: 0.2
    },
    { 
      code: 'JPY', 
      name: 'Jen japoński', 
      flag: '🇯🇵',
      rate: 0.027,
      change: -0.1
    },
    { 
      code: 'CAD', 
      name: 'Dolar kanadyjski', 
      flag: '🇨🇦',
      rate: 2.85,
      change: 0.4
    },
    { 
      code: 'AUD', 
      name: 'Dolar australijski', 
      flag: '🇦🇺',
      rate: 2.56,
      change: -0.2
    },
    { 
      code: 'CNY', 
      name: 'Juan chiński', 
      flag: '🇨🇳',
      rate: 0.55,
      change: 0.1
    },
    { 
      code: 'SEK', 
      name: 'Korona szwedzka', 
      flag: '🇸🇪',
      rate: 0.38,
      change: 0.3
    },
    { 
      code: 'NOK', 
      name: 'Korona norweska', 
      flag: '🇳🇴',
      rate: 0.37,
      change: -0.4
    }
  ])

  const cryptocurrencies = ref([
    {
      code: 'BTC',
      name: 'Bitcoin',
      symbol: '₿',
      rate: 412500.00,
      change: 2.5,
      icon: 'mdi-bitcoin'
    },
    {
      code: 'ETH',
      name: 'Ethereum',
      symbol: 'Ξ',
      rate: 13800.00,
      change: 1.8,
      icon: 'mdi-ethereum'
    },
    {
      code: 'USDT',
      name: 'Tether',
      symbol: '₮',
      rate: 4.02,
      change: 0.0,
      icon: 'mdi-currency-usd'
    },
    {
      code: 'BNB',
      name: 'Binance Coin',
      symbol: 'BNB',
      rate: 2450.00,
      change: -1.2,
      icon: 'mdi-hexagon-multiple'
    },
    {
      code: 'SOL',
      name: 'Solana',
      symbol: 'SOL',
      rate: 820.00,
      change: 3.4,
      icon: 'mdi-triangle'
    },
    {
      code: 'XRP',
      name: 'Ripple',
      symbol: 'XRP',
      rate: 9.20,
      change: 0.9,
      icon: 'mdi-water'
    },
    {
      code: 'ADA',
      name: 'Cardano',
      symbol: '₳',
      rate: 3.85,
      change: -0.5,
      icon: 'mdi-alpha-a-circle'
    },
    {
      code: 'DOGE',
      name: 'Dogecoin',
      symbol: 'Ð',
      rate: 0.68,
      change: 5.2,
      icon: 'mdi-dog'
    },
    {
      code: 'DOT',
      name: 'Polkadot',
      symbol: 'DOT',
      rate: 28.50,
      change: 1.1,
      icon: 'mdi-circle-multiple'
    },
    {
      code: 'MATIC',
      name: 'Polygon',
      symbol: 'MATIC',
      rate: 3.42,
      change: -2.1,
      icon: 'mdi-hexagon'
    }
  ])

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
      const res = await fetch('https://api.coingecko.com/api/v3/global')
      if (!res.ok) throw new Error('Failed to fetch market stats')
      const json = await res.json()

      const marketCapUSD = json?.data?.total_market_cap?.usd ?? null
      const volumeUSD = json?.data?.total_volume?.usd ?? null
      const btcDominance = json?.data?.market_cap_percentage?.btc ?? null

      const usdEntry = currencies.value.find(c => c.code === 'USD')
      const usdRate = usdEntry ? usdEntry.rate : null

      if (marketCapUSD != null && usdRate != null) {
        marketStats.value.marketCapPLN = marketCapUSD * usdRate
      } else {
        marketStats.value.marketCapPLN = null
      }

      if (volumeUSD != null && usdRate != null) {
        marketStats.value.volume24hPLN = volumeUSD * usdRate
      } else {
        marketStats.value.volume24hPLN = null
      }

      marketStats.value.btcDominance = typeof btcDominance === 'number' ? btcDominance : null
      marketStats.value.updatedAt = new Date().toISOString()
    } catch (err) {
      console.error('fetchMarketStats error:', err)
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

  return {
    currencies,
    cryptocurrencies,
    formatCurrency,
    convertCurrency,
    // market stats & helpers
    marketStats,
    fetchMarketStats,
    formatLargePLN
  }
}