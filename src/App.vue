<template>
  <v-app>
    <v-app-bar color="primary" elevation="2" prominent>
      <v-container class="d-flex align-center">
        <v-app-bar-title class="d-flex align-center">
          <v-icon size="40" class="mr-3">mdi-cash-multiple</v-icon>
          <span class="text-h5 font-weight-bold">Kantor Online</span>
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <v-btn
          :to="{ name: 'home' }"
          :variant="$route.name === 'home' ? 'flat' : 'text'"
          :color="$route.name === 'home' ? 'white' : ''"
          prepend-icon="mdi-home"
        >
          Strona główna
        </v-btn>

        <v-btn
          :to="{ name: 'exchange' }"
          :variant="$route.name === 'exchange' ? 'flat' : 'text'"
          :color="$route.name === 'exchange' ? 'white' : ''"
          prepend-icon="mdi-swap-horizontal"
        >
          Wymień waluty
        </v-btn>

        <v-btn
          :to="{ name: 'crypto' }"
          :variant="$route.name === 'crypto' ? 'flat' : 'text'"
          :color="$route.name === 'crypto' ? 'white' : ''"
          prepend-icon="mdi-bitcoin"
        >
          Krypto
        </v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <v-footer color="white" class="border-t">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" class="text-center">
            <p class="text-body-2 text-grey-darken-1">
              © 2025 Kantor Online. Kursy walut są orientacyjne i mogą się różnić od kursów rzeczywistych.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
</script>