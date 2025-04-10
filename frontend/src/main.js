import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './assets/styles/global.css'
import { API_URL } from '@/config'

// Configuration globale d'axios
axios.defaults.baseURL = API_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Récupérer le token du localStorage s'il existe
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

createApp(App)
  .use(store)
  .use(router)
  .mount('#app') 