import axios from 'axios';
import { API_URL } from '@/config';

export default {
  namespaced: true,

  state: {
    themes: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_THEMES(state, themes) {
      state.themes = themes;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  actions: {
    async fetchThemes({ commit, rootState }) {
      console.log('Début de fetchThemes');
      console.log('Token disponible:', !!rootState.auth.token);
      
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      try {
        console.log('Envoi de la requête à:', `${API_URL}/themes`);
        const response = await axios.get(`${API_URL}/themes`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`
          }
        });
        console.log('Réponse reçue:', response.data);
        commit('SET_THEMES', response.data);
      } catch (error) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la récupération des thèmes');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  getters: {
    allThemes: state => state.themes,
    isLoading: state => state.loading,
    error: state => state.error
  }
}; 