import axios from 'axios';
import { API_URL } from '@/config';

export default {
  namespaced: true,
  state: {
    themes: [],
    loading: false,
    error: null,
    currentTheme: null
  },
  mutations: {
    SET_THEMES(state, themes) {
      state.themes = themes.map(theme => ({
        ...theme,
        isApproved: theme.status === 'approved'
      }));
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_CURRENT_THEME(state, theme) {
      state.currentTheme = theme;
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
    },
    async fetchTheme({ commit, rootState }, themeId) {
      console.log('Début de fetchTheme pour l\'ID:', themeId);
      console.log('Token disponible:', !!rootState.auth.token);
      
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);

      try {
        console.log('Envoi de la requête à:', `${API_URL}/themes/${themeId}`);
        const response = await axios.get(`${API_URL}/themes/${themeId}`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`
          }
        });
        console.log('Réponse reçue:', response.data);
        commit('SET_CURRENT_THEME', response.data);
        return response.data;
      } catch (error) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la récupération du thème');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async createTheme({ commit, state, rootState }, themeData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await axios.post(`${API_URL}/themes`, themeData, {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`
          }
        });
        
        commit('SET_THEMES', [...state.themes, response.data]);
        return response.data;
      } catch (error) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la création du thème');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async approveTheme({ commit, state, rootState }, themeId) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await axios.post(`${API_URL}/themes/${themeId}/approve`, {}, {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`
          }
        });
        
        const updatedThemes = state.themes.map(theme => 
          theme.id === themeId ? response.data : theme
        );
        
        commit('SET_THEMES', updatedThemes);
        return response.data;
      } catch (error) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de l\'approbation du thème');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async rejectTheme({ commit, state, rootState }, themeId) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await axios.post(`${API_URL}/themes/${themeId}/reject`, {}, {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`
          }
        });
        
        const updatedThemes = state.themes.map(theme => 
          theme.id === themeId ? response.data : theme
        );
        
        commit('SET_THEMES', updatedThemes);
        return response.data;
      } catch (error) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors du rejet du thème');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async grantAccess({ commit, rootState }, { themeId, patientId }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await axios.post(`${API_URL}/themes/grant-access`, { themeId, patientId }, {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`
          }
        });
        
        return response.data;
      } catch (error) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de l\'attribution de l\'accès au thème');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async revokeAccess({ commit, rootState }, { themeId, patientId }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await axios.post(`${API_URL}/themes/revoke-access`, { themeId, patientId }, {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`
          }
        });
        
        return response.data;
      } catch (error) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la révocation de l\'accès au thème');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async fetchUserThemes({ commit, rootState }, userId) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await axios.get(`${API_URL}/themes/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`
          }
        });
        
        return response.data;
      } catch (error) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la récupération des thèmes de l\'utilisateur');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  getters: {
    allThemes: state => state.themes,
    isLoading: state => state.loading,
    error: state => state.error,
    isThemeApproved: state => themeId => {
      const theme = state.themes.find(t => t.id === themeId);
      return theme ? theme.status === 'approved' : false;
    }
  }
}; 