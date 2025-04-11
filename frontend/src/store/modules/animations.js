import axios from 'axios';
import { API_URL } from '@/config';

export default {
  namespaced: true,
  state: {
    items: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_ANIMATIONS(state, animations) {
      state.items = animations;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchAnimations({ commit, rootState }, themeId) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        console.log('Début de fetchAnimations pour le thème:', themeId);
        console.log('Token disponible:', !!rootState.auth.token);
        
        const url = themeId 
          ? `${API_URL}/themes/${themeId}/animations`
          : `${API_URL}/animations`;
        
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`
          }
        });
        
        console.log('Réponse reçue:', response.data);
        commit('SET_ANIMATIONS', response.data);
        return response.data;
      } catch (error) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la récupération des animations');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async createAnimation({ commit, state, rootState }, formData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await axios.post(`${API_URL}/animations/create`, formData, {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        commit('SET_ANIMATIONS', [...state.items, response.data]);
        return response.data;
      } catch (error) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la création de l\'animation');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async approveAnimation({ commit, state, rootState }, animationId) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await axios.post(`${API_URL}/animations/${animationId}/approve`, {}, {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`
          }
        });
        
        const updatedAnimations = state.items.map(animation => 
          animation.id === animationId ? response.data : animation
        );
        
        commit('SET_ANIMATIONS', updatedAnimations);
        return response.data;
      } catch (error) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de l\'approbation de l\'animation');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async rejectAnimation({ commit, state, rootState }, animationId) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await axios.post(`${API_URL}/animations/${animationId}/reject`, {}, {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`
          }
        });
        
        const updatedAnimations = state.items.map(animation => 
          animation.id === animationId ? response.data : animation
        );
        
        commit('SET_ANIMATIONS', updatedAnimations);
        return response.data;
      } catch (error) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du rejet de l\'animation');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
}; 