<template>
  <div>
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <h1 class="text-h3 font-weight-bold mb-2">Aktualne kursy walut</h1>
        <p class="text-h6 text-grey-darken-1">Sprawdź najnowsze kursy najpopularniejszych walut</p>
      </v-col>
      <v-col cols="12" md="4" class="d-flex align-end justify-end">
        <v-btn
          @click="fetchExchangeRates"
          :loading="loading"
          color="primary"
          prepend-icon="mdi-refresh"
          variant="outlined"
        >
          Odśwież kursy
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="2">
      <!-- Loading state -->
      <div v-if="loading" class="text-center pa-8">
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="text-subtitle-1 mt-4">Ładowanie kursów walut...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="pa-6">
        <v-alert
          type="error"
          variant="tonal"
          class="mb-4"
        >
          <strong>Błąd podczas pobierania danych:</strong> {{ error }}
        </v-alert>
        <v-btn
          @click="fetchExchangeRates"
          color="primary"
          prepend-icon="mdi-refresh"
        >
          Spróbuj ponownie
        </v-btn>
      </div>

      <!-- Data table -->
      <v-table v-else-if="currencies.length > 0">
        <thead>
          <tr>
            <th class="text-left">Waluta</th>
            <th class="text-left">Kod</th>
            <th class="text-right">Kupno</th>
            <th class="text-right">Sprzedaż</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="currency in currencies"
            :key="currency.code"
            class="currency-row clickable-row"
            @click="navigateToExchange(currency.code)"
          >
            <td>
              <div class="d-flex align-center">
                <span class="text-h5 mr-3">{{ currency.flag }}</span>
                <span class="font-weight-medium">{{ currency.currency }}</span>
              </div>
            </td>
            <td>
              <v-chip color="primary" variant="tonal" size="small">
                {{ currency.code }}
              </v-chip>
            </td>
            <td class="text-right">
              <span class="text-h6 font-weight-bold">
                {{ formatCurrency(currency.bid, 4) }} zł
              </span>
            </td>
            <td class="text-right">
              <span class="text-h6 font-weight-bold">
                {{ formatCurrency(currency.ask, 4) }} zł
              </span>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Empty state -->
      <div v-else class="text-center pa-8">
        <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-currency-usd-off</v-icon>
        <p class="text-subtitle-1 text-grey-darken-1">Brak dostępnych kursów walut</p>
      </div>
    </v-card>

    <v-alert
      type="info"
      variant="tonal"
      class="mt-6"
      icon="mdi-information"
    >
      Kursy są aktualizowane co godzinę i mają charakter orientacyjny.
      Rzeczywiste kursy wymiany mogą się różnić.
    </v-alert>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrencyData } from '../composables/useCurrencyData'

const { 
  currencies, 
  formatCurrency, 
  fetchExchangeRates, 
  loading, 
  error, 
  init,
  startAutoRefresh,
  stopAutoRefresh 
} = useCurrencyData()
const router = useRouter()

onMounted(async () => {
  await init()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})

const navigateToExchange = (currencyCode) => {
  router.push({
    name: 'exchange',
    query: { to: currencyCode }
  })
}
</script>

<style scoped>

.clickable-row {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.clickable-row:hover {
  background-color: rgba(33, 150, 243, 0.08);
}
</style>