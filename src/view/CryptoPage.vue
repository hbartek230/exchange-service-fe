<template>
  <div>
    <v-row class="mb-6">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Kursy kryptowalut</h1>
        <p class="text-h6 text-grey-darken-1">Śledź najnowsze kursy najpopularniejszych kryptowalut</p>
      </v-col>
    </v-row>

    <v-card elevation="2">
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Kryptowaluta</th>
            <th class="text-left">Symbol</th>
            <th class="text-right">Kurs (PLN)</th>
            <th class="text-right">Zmiana 24h</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="crypto in cryptocurrencies"
            :key="crypto.code"
            class="crypto-row"
          >
            <td>
              <div class="d-flex align-center">
                <v-avatar color="primary" size="40" class="mr-3">
                  <v-icon color="white">{{ crypto.icon }}</v-icon>
                </v-avatar>
                <span class="font-weight-medium">{{ crypto.name }}</span>
              </div>
            </td>
            <td>
              <v-chip color="secondary" variant="tonal" size="small">
                {{ crypto.code }}
              </v-chip>
            </td>
            <td class="text-right">
              <span class="text-h6 font-weight-bold">
                {{ formatCurrency(crypto.rate, crypto.rate < 100 ? 4 : 2) }} zł
              </span>
            </td>
            <td class="text-right">
              <v-chip
                :color="crypto.change >= 0 ? 'success' : 'error'"
                variant="tonal"
                size="small"
              >
                <v-icon
                  :icon="crypto.change >= 0 ? 'mdi-arrow-up' : 'mdi-arrow-down'"
                  size="small"
                  class="mr-1"
                ></v-icon>
                {{ Math.abs(crypto.change) }}%
              </v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- Statystyki -->
    <v-row class="mt-6">
      <v-col cols="12" md="4">
        <v-card color="primary" variant="tonal" elevation="2">
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-icon size="32" class="mr-3">mdi-chart-line</v-icon>
              <span class="text-h6 font-weight-medium">Kapitalizacja rynku</span>
            </div>
            <p class="text-h4 font-weight-bold primary--text">8.2 bln zł</p>
            <p class="text-body-2 text-grey-darken-1">Łączna wartość rynku</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="success" variant="tonal" elevation="2">
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-icon size="32" class="mr-3">mdi-wallet</v-icon>
              <span class="text-h6 font-weight-medium">Wolumen 24h</span>
            </div>
            <p class="text-h4 font-weight-bold success--text">412 mld zł</p>
            <p class="text-body-2 text-grey-darken-1">Obrót dzienny</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card color="secondary" variant="tonal" elevation="2">
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-icon size="32" class="mr-3">mdi-bitcoin</v-icon>
              <span class="text-h6 font-weight-medium">Dominacja BTC</span>
            </div>
            <p class="text-h4 font-weight-bold secondary--text">58.4%</p>
            <p class="text-body-2 text-grey-darken-1">Udział Bitcoina</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-alert
      type="warning"
      variant="tonal"
      class="mt-6"
      icon="mdi-alert"
      prominent
    >
      <v-alert-title class="font-weight-bold">Uwaga!</v-alert-title>
      Inwestowanie w kryptowaluty wiąże się z wysokim ryzykiem.
      Kursy są bardzo zmienne i mogą się znacznie różnić.
      Zawsze sprawdzaj aktualne kursy przed dokonaniem transakcji.
    </v-alert>
  </div>
</template>

<script setup>
import { useCurrencyData } from '../composables/useCurrencyData'

const { cryptocurrencies, formatCurrency } = useCurrencyData()
</script>

<style scoped>
.crypto-row:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>