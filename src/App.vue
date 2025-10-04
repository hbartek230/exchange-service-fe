<script setup>
import { RouterLink } from 'vue-router'

const navItems = [
  { name: 'home', icon: 'mdi-home', text: 'Strona główna' },
  { name: 'exchange', icon: 'mdi-swap-horizontal', text: 'Wymień waluty' },
  { name: 'crypto', icon: 'mdi-bitcoin', text: 'Krypto' }
]
</script>

<template>
  <v-app>
    <v-app-bar color="primary" elevation="2" prominent>
      <v-container class="d-flex align-center">
        <v-app-bar-title class="d-flex align-center">
          <v-icon size="40" class="mr-3">mdi-cash-multiple</v-icon>
          <span class="text-h5 font-weight-bold">Kantor Online</span>
        </v-app-bar-title>

        <v-spacer></v-spacer>

        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          custom
          v-slot="{ navigate, href, isActive }"
        >
          <v-btn
            :href="href"
            @click="navigate"
            :variant="isActive ? 'flat' : 'text'"
            :color="isActive ? 'white' : ''"
            :prepend-icon="item.icon"
          >
            {{ item.text }}
          </v-btn>
        </RouterLink>
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