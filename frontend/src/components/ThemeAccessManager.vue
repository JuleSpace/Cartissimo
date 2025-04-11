<template>
  <div class="theme-access-manager">
    <div class="header">
      <h2>Gestion des accès aux thèmes</h2>
    </div>

    <div v-if="loading" class="loading">
      Chargement...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="content">
      <!-- Sélection du patient -->
      <div class="patient-selector">
        <h3>Sélectionner un patient</h3>
        <select v-model="selectedPatientId" @change="loadPatientThemes">
          <option value="">Choisir un patient</option>
          <option v-for="patient in patients" :key="patient.id" :value="patient.id">
            {{ patient.firstName }} {{ patient.lastName }}
          </option>
        </select>
      </div>

      <!-- Liste des thèmes disponibles -->
      <div v-if="selectedPatientId" class="themes-section">
        <div class="available-themes">
          <h3>Thèmes disponibles</h3>
          <div class="themes-grid">
            <div v-for="theme in availableThemes" :key="theme.id" class="theme-card">
              <h4>{{ theme.name }}</h4>
              <p>{{ theme.description }}</p>
              <button @click="grantAccess(theme.id)" class="btn-grant">
                Accorder l'accès
              </button>
            </div>
          </div>
        </div>

        <div class="granted-themes">
          <h3>Thèmes accordés</h3>
          <div class="themes-grid">
            <div v-for="theme in grantedThemes" :key="theme.id" class="theme-card">
              <h4>{{ theme.name }}</h4>
              <p>{{ theme.description }}</p>
              <button @click="revokeAccess(theme.id)" class="btn-revoke">
                Révoquer l'accès
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'ThemeAccessManager',
  setup() {
    const store = useStore();
    const loading = ref(false);
    const error = ref('');
    const patients = ref([]);
    const selectedPatientId = ref('');
    const availableThemes = ref([]);
    const grantedThemes = ref([]);

    const loadPatients = async () => {
      try {
        loading.value = true;
        error.value = '';
        // Charger la liste des patients de l'orthophoniste
        const response = await store.dispatch('patients/fetchPatients');
        patients.value = response;
      } catch (err) {
        error.value = err.message || 'Erreur lors du chargement des patients';
      } finally {
        loading.value = false;
      }
    };

    const loadPatientThemes = async () => {
      if (!selectedPatientId.value) return;

      try {
        loading.value = true;
        error.value = '';
        
        // Charger tous les thèmes
        await store.dispatch('themes/fetchThemes');
        const allThemes = store.state.themes.themes;
        
        // Charger les thèmes accordés au parent du patient
        const patient = patients.value.find(p => p.id === selectedPatientId.value);
        if (!patient) return;

        const parentThemes = await store.dispatch('themes/fetchUserThemes', patient.userId);
        
        // Filtrer les thèmes disponibles et accordés
        grantedThemes.value = allThemes.filter(theme => 
          parentThemes.some(pt => pt.id === theme.id)
        );
        
        availableThemes.value = allThemes.filter(theme => 
          !parentThemes.some(pt => pt.id === theme.id) &&
          theme.status === 'approved'
        );
      } catch (err) {
        error.value = err.message || 'Erreur lors du chargement des thèmes';
      } finally {
        loading.value = false;
      }
    };

    const grantAccess = async (themeId) => {
      try {
        loading.value = true;
        error.value = '';
        await store.dispatch('themes/grantAccess', {
          themeId,
          patientId: selectedPatientId.value
        });
        await loadPatientThemes();
      } catch (err) {
        error.value = err.message || 'Erreur lors de l\'attribution de l\'accès';
      } finally {
        loading.value = false;
      }
    };

    const revokeAccess = async (themeId) => {
      try {
        loading.value = true;
        error.value = '';
        await store.dispatch('themes/revokeAccess', {
          themeId,
          patientId: selectedPatientId.value
        });
        await loadPatientThemes();
      } catch (err) {
        error.value = err.message || 'Erreur lors de la révocation de l\'accès';
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadPatients();
    });

    return {
      loading,
      error,
      patients,
      selectedPatientId,
      availableThemes,
      grantedThemes,
      loadPatientThemes,
      grantAccess,
      revokeAccess
    };
  }
};
</script>

<style scoped>
.theme-access-manager {
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.header h2 {
  color: var(--blue);
  font-size: 1.8rem;
  margin: 0;
}

.patient-selector {
  margin-bottom: 2rem;
}

.patient-selector select {
  width: 100%;
  max-width: 400px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.themes-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.theme-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-card h4 {
  margin: 0 0 0.5rem 0;
  color: var(--blue);
}

.theme-card p {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.9rem;
}

.btn-grant, .btn-revoke {
  width: 100%;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-grant {
  background: #4CAF50;
  color: white;
}

.btn-grant:hover {
  background: #45a049;
}

.btn-revoke {
  background: #f44336;
  color: white;
}

.btn-revoke:hover {
  background: #da190b;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #f44336;
}

@media (max-width: 768px) {
  .themes-section {
    grid-template-columns: 1fr;
  }
}
</style> 