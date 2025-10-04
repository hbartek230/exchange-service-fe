<template>
  <div>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Wymiana walut</h1>
        <p class="text-h6 text-grey-darken-1">Przelicz dowolną kwotę między dostępnymi walutami</p>
      </v-col>
    </v-row>

    <v-card elevation="2" class="pa-6">
      <v-row class="justify-center">
        <v-col cols="12" md="10" lg="8">
          <!-- Waluta źródłowa -->
          <v-row class="mb-4">
            <v-col cols="12">
              <p class="text-subtitle-1 font-weight-medium mb-2">Z waluty</p>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="fromCurrency"
                :items="currencyOptions"
                item-title="label"
                item-value="code"
                variant="outlined"
                density="comfortable"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="fromAmount"
                type="number"
                variant="outlined"
                density="comfortable"
                hide-details
                :suffix="fromCurrency"
                class="text-right"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Przycisk zamiany -->
          <v-row class="justify-center mb-4">
            <v-col cols="auto">
              <v-btn
                @click="swapCurrencies"
                icon
                size="large"
                color="primary"
                elevation="2"
              >
                <v-icon>mdi-swap-vertical</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <!-- Waluta docelowa -->
          <v-row class="mb-6">
            <v-col cols="12">
              <p class="text-subtitle-1 font-weight-medium mb-2">Na walutę</p>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="toCurrency"
                :items="currencyOptions"
                item-title="label"
                item-value="code"
                variant="outlined"
                density="comfortable"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="toAmount"
                type="number"
                variant="outlined"
                density="comfortable"
                hide-details
                readonly
                :suffix="toCurrency"
                class="text-right"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Informacja o kursie -->
          <v-card color="primary" variant="tonal" class="pa-6">
            <v-card-text class="text-center">
              <p class="text-subtitle-2 text-grey-darken-2 mb-2">Aktualny kurs wymiany</p>
              <p class="text-h4 font-weight-bold primary--text mb-3">
                1 {{ fromCurrency }} = {{ formatCurrency(exchangeRate, 6) }} {{ toCurrency }}
              </p>
              <p class="text-body-2 text-grey-darken-1">
                {{ formatCurrency(fromAmount, 2) }} {{ fromCurrency }} = 
                {{ formatCurrency(toAmount, 2) }} {{ toCurrency }}
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCurrencyData } from '../composables/useCurrencyData'

const { currencies, cryptocurrencies, formatCurrency, convertCurrency } = useCurrencyData()

// Przygotuj opcje dla select
const currencyOptions = computed(() => {
  const allCurr = [
    { code: 'PLN', label: '🇵🇱 PLN - Polski złoty', flag: '🇵🇱' },
    ...currencies.value.map(c => ({
      code: c.code,
      label: `${c.flag} ${c.code} - ${c.name}`,
      flag: c.flag,
      rate: c.rate
    })),
    ...cryptocurrencies.value.map(c => ({
      code: c.code,
      label: `${c.symbol} ${c.code} - ${c.name}`,
      flag: c.symbol,
      rate: c.rate
    }))
  ]
  return allCurr
})

const allCurrenciesMap = computed(() => {
  const map = { 'PLN': { rate: 1 } }
  ;[...currencies.value, ...cryptocurrencies.value].forEach(c => {
    map[c.code] = c
  })
  return map
})

const fromCurrency = ref('PLN')
const toCurrency = ref('USD')
const fromAmount = ref(100)
const toAmount = ref(0)

const getRate = (code) => {
  const entry = allCurrenciesMap.value[code]
  return entry ? entry.rate : 1
}

const exchangeRate = computed(() => {
  const fromRate = getRate(fromCurrency.value)
  const toRate = getRate(toCurrency.value)
  return toRate ? fromRate / toRate : 0
})

const calculate = () => {
  const fromRate = getRate(fromCurrency.value)
  const toRate = getRate(toCurrency.value)
  toAmount.value = convertCurrency(fromAmount.value, fromRate, toRate)
}

const swapCurrencies = () => {
  [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value]
  fromAmount.value = toAmount.value
}

watch([fromCurrency, toCurrency, fromAmount], calculate, { immediate: true })
</script>