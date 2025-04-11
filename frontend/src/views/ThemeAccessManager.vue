<template>
  <div class="theme-access-manager">
    <div class="header">
      <h1>Gestion des accès - {{ currentTheme?.name || 'Chargement...' }}</h1>
      <button @click="$router.push('/themes')" class="btn-back">
        Retour aux thèmes
      </button>
    </div>

    <div class="admin-sections">
      <section class="admin-section">
        <h2>Liste des patients</h2>
        <div v-if="loading" class="loading">Chargement...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="patients.length === 0" class="empty-state">
          Aucun patient disponible
        </div>
        <div v-else class="patients-list">
          <div v-for="patient in patients" :key="patient.id" class="patient-card">
            <div class="patient-info">
              <div class="patient-avatar">
                <i class="fas fa-user-circle"></i>
              </div>
              <div class="patient-details">
                <h3>{{ patient.firstName }} {{ patient.lastName }}</h3>
                <p>ID: {{ patient.id }}</p>
              </div>
            </div>
            <div class="access-status">
              <span :class="['status-badge', hasAccess(patient.id) ? 'status-granted' : 'status-denied']">
                {{ hasAccess(patient.id) ? 'Accès accordé' : 'Accès refusé' }}
              </span>
            </div>
            <div class="card-actions">
              <button 
                @click="toggleAccess(patient.id)"
                :class="['action-button', hasAccess(patient.id) ? 'btn-reject' : 'btn-approve']"
                :disabled="loading"
              >
                {{ hasAccess(patient.id) ? 'Révoquer l\'accès' : 'Accorder l\'accès' }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

export default {
  name: 'ThemeAccessManager',
  setup() {
    const store = useStore();
    const route = useRoute();
    const patients = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const themeId = route.params.themeId;
    const themeAccess = ref(new Set());
    const currentTheme = ref(null);

    const fetchData = async () => {
      loading.value = true;
      try {
        // Récupérer le thème
        await store.dispatch('themes/fetchTheme', themeId);
        currentTheme.value = store.state.themes.currentTheme;

        // Récupérer les patients
        const response = await store.dispatch('patients/fetchPatients');
        patients.value = response;

        // Récupérer les accès actuels pour chaque patient
        for (const patient of patients.value) {
          try {
            const userThemes = await store.dispatch('themes/fetchUserThemes', patient.userId);
            const hasAccess = userThemes.some(theme => theme.id === parseInt(themeId));
            if (hasAccess) {
              themeAccess.value.add(patient.id);
            }
          } catch (err) {
            console.error(`Erreur lors de la récupération des accès pour le patient ${patient.id}:`, err);
          }
        }
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    const grantAccess = async (patientId) => {
      try {
        await store.dispatch('themes/grantAccess', {
          themeId,
          patientId
        });
        themeAccess.value.add(patientId);
      } catch (err) {
        error.value = err.message;
      }
    };

    const revokeAccess = async (patientId) => {
      try {
        await store.dispatch('themes/revokeAccess', {
          themeId,
          patientId
        });
        themeAccess.value.delete(patientId);
      } catch (err) {
        error.value = err.message;
      }
    };

    const hasAccess = (patientId) => {
      return themeAccess.value.has(patientId);
    };

    const toggleAccess = async (patientId) => {
      try {
        loading.value = true;
        if (hasAccess(patientId)) {
          await revokeAccess(patientId);
        } else {
          await grantAccess(patientId);
        }
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      fetchData();
    });

    return {
      patients,
      loading,
      error,
      currentTheme,
      hasAccess,
      toggleAccess
    };
  }
};
</script>

<style scoped>
.theme-access-manager {
  padding: 0.5rem;
  max-width: 1200px;
  margin: 70px auto 0;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
}

.header h1 {
  font-size: 1.25rem;
  margin: 0;
  line-height: 1.3;
}

.admin-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.admin-section {
  background: white;
  border-radius: 12px;
  padding: 1rem 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-section h2 {
  font-size: 1.1rem;
  margin: 0 0 1rem 0;
  padding: 0 0.5rem;
}

.patients-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding: 0 0.25rem;
}

.patient-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.patient-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
}

.patient-avatar {
  display: none;
}

.patient-details {
  width: 100%;
  text-align: center;
}

.patient-details h3 {
  font-size: 0.95rem;
  line-height: 1.2;
  margin: 0;
}

.patient-details p {
  font-size: 0.8rem;
  margin-top: 0.2rem;
  color: #666;
}

.access-status {
  margin: 0.5rem 0;
  width: 100%;
}

.status-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  margin: 0.25rem 0;
}

.status-granted {
  background-color: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
}

.status-denied {
  background-color: rgba(244, 67, 54, 0.1);
  color: #c62828;
}

.card-actions {
  width: 100%;
  margin-top: auto;
}

.action-button {
  width: 100%;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid;
  cursor: pointer;
  background: transparent;
  transition: all 0.2s ease;
}

.action-button.btn-approve {
  color: #2e7d32;
  border-color: #2e7d32;
}

.action-button.btn-approve:hover {
  background-color: rgba(76, 175, 80, 0.1);
}

.action-button.btn-reject {
  color: #c62828;
  border-color: #c62828;
}

.action-button.btn-reject:hover {
  background-color: rgba(244, 67, 54, 0.1);
}

@media (min-width: 768px) {
  .theme-access-manager {
    padding: 1rem;
    margin: 40px auto 0;
  }

  .header {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0;
  }

  .header h1 {
    font-size: 1.5rem;
  }

  .admin-section {
    padding: 1.5rem;
  }

  .patients-list {
    padding: 0;
    gap: 1rem;
  }

  .patient-card {
    padding: 1rem;
  }
}

.btn-back {
  padding: 0.5rem 1rem;
  background-color: #4B95DE;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

@media (min-width: 768px) {
  .btn-back {
    width: auto;
  }
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #f44336;
}
</style> 