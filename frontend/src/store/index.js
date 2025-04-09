import { createStore } from 'vuex';
import axios from 'axios';
import auth from './modules/auth';
import theme from './modules/theme';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

export default createStore({
  state: {
    // État global si nécessaire
  },
  mutations: {
    // Mutations globales si nécessaires
  },
  actions: {
    async fetchAnimations({ rootState }, themeId) {
      const response = await axios.get(`${API_URL}/animations/theme/${themeId}`, {
        headers: {
          Authorization: `Bearer ${rootState.auth.token}`
        }
      });
      return response.data;
    }
  },
  getters: {
    // Getters globaux si nécessaires
  },
  modules: {
    auth,
    theme
  }
}); 