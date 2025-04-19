import axios from 'axios';
import { API_URL } from '@/config';

export default {
  namespaced: true,
  state: {
    patients: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_PATIENTS(state, patients) {
      state.patients = patients;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchPatients({ commit, rootState }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        
        const response = await axios.get(`${API_URL}/patients`, {
          headers: {
            Authorization: `Bearer ${rootState.auth.token}`
          }
        });
        
        commit('SET_PATIENTS', response.data);
        return response.data;
      } catch (error) {
        console.error('Erreur détaillée:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        commit('SET_ERROR', error.response?.data?.message || 'Erreur lors de la récupération des patients');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },
  getters: {
    allPatients: state => state.patients,
    isLoading: state => state.loading,
    error: state => state.error
  }
}; 