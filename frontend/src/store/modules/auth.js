import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';

export default {
  namespaced: true,
  
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  actions: {
    async login({ commit }, credentials) {
      console.log('🔐 Début de la tentative de connexion avec:', { email: credentials.email });
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      
      try {
        console.log('📤 Envoi de la requête à:', `${API_URL}/auth/login`);
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        console.log('📥 Réponse reçue:', response.data);
        
        const { token, user } = response.data;
        
        if (!token || !user) {
          console.error('❌ Réponse invalide - token ou user manquant:', response.data);
          throw new Error('Réponse invalide du serveur');
        }

        console.log('✅ Token et utilisateur valides, mise à jour du store');
        commit('SET_TOKEN', token);
        commit('SET_USER', user);
        return response.data;
      } catch (error) {
        console.error('❌ Erreur lors de la connexion:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        const message = error.response?.data?.message || 'Erreur de connexion';
        commit('SET_ERROR', message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
        console.log('🏁 Fin de la tentative de connexion');
      }
    },

    async logout({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_TOKEN', null);
        commit('SET_USER', null);
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async checkAuth({ commit, state }) {
      if (!state.token) return;
      
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${state.token}`
          }
        });
        commit('SET_USER', response.data);
      } catch (error) {
        commit('SET_TOKEN', null);
        commit('SET_USER', null);
        throw error;
      }
    }
  },

  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    isLoading: state => state.loading,
    error: state => state.error
  }
}; 