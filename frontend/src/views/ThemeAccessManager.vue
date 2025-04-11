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
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-back {
  padding: 0.5rem 1rem;
  background-color: #4B95DE;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.admin-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.admin-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.patients-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.patient-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.patient-avatar {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e9ecef;
  border-radius: 50%;
  color: #4B95DE;
}

.patient-details h3 {
  margin: 0;
  color: #2C3E50;
  font-size: 1.1rem;
}

.patient-details p {
  margin: 0.25rem 0 0 0;
  color: #666;
  font-size: 0.9rem;
}

.access-status {
  margin: 1rem 0;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
}

.status-granted {
  background-color: #4CAF50;
  color: white;
}

.status-denied {
  background-color: #f44336;
  color: white;
}

.card-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.action-button {
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-approve {
  background-color: #4CAF50;
  color: white;
}

.btn-reject {
  background-color: #f44336;
  color: white;
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