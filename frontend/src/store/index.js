import { createStore } from 'vuex';
import axios from 'axios';
import auth from './modules/auth';
import themes from './modules/themes';
import animations from './modules/animations';
import patients from './modules/patients';
import { API_URL } from '@/config';

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
    themes,
    animations,
    patients
  }
}); 