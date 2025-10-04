<template>
  <div>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Aktualne kursy walut</h1>
        <p class="text-h6 text-grey-darken-1">Sprawdź najnowsze kursy najpopularniejszych walut</p>
      </v-col>
    </v-row>

    <v-card elevation="2">
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Waluta</th>
            <th class="text-left">Kod</th>
            <th class="text-right">Kurs (PLN)</th>
            <th class="text-right">Zmiana 24h</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="currency in currencies"
            :key="currency.code"
            class="currency-row"
          >
            <td>
              <div class="d-flex align-center">
                <span class="text-h5 mr-3">{{ currency.flag }}</span>
                <span class="font-weight-medium">{{ currency.name }}</span>
              </div>
            </td>
            <td>
              <v-chip color="primary" variant="tonal" size="small">
                {{ currency.code }}
              </v-chip>
            </td>
            <td class="text-right">
              <span class="text-h6 font-weight-bold">
                {{ formatCurrency(currency.rate, 4) }} zł
              </span>
            </td>
            <td class="text-right">
              <v-chip
                :color="currency.change >= 0 ? 'success' : 'error'"
                variant="tonal"
                size="small"
              >
                <v-icon
                  :icon="currency.change >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'"
                  size="small"
                  class="mr-1"
                ></v-icon>
                {{ Math.abs(currency.change) }}%
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
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
import { useCurrencyData } from '../composables/useCurrencyData'

const { currencies, formatCurrency } = useCurrencyData()
</script>

<style scoped>
.currency-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>