import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import App from './App.vue'
//import HomePage from './views/HomePage.vue'
//import ExchangePage from './views/ExchangePage.vue'
//import CryptoPage from './views/CryptoPage.vue'

// Konfiguracja Vuetify z Material Design 3
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#2196F3',
          secondary: '#607D8B',
          accent: '#FF5722',
          error: '#F44336',
          warning: '#FF9800',
          info: '#2196F3',
          success: '#4CAF50',
          background: '#F5F5F5',
        },
      },
    },
  },
})

// Konfiguracja routera
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage, name: 'home' },
    { path: '/exchange', component: ExchangePage, name: 'exchange' },
    { path: '/krypto', component: CryptoPage, name: 'crypto' }
  ]
})

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.mount('#app')