<template>
  <div class="admin-panel">
    <div class="header">
      <h1>Panneau d'administration</h1>
      <button @click="$router.push('/themes')" class="btn-back">
        Retour aux thèmes
      </button>
    </div>

    <!-- Navigation entre les sections -->
    <div class="admin-navigation">
      <button 
        @click="currentSection = 'themes'" 
        :class="['nav-button', { active: currentSection === 'themes' }]"
      >
        <span class="nav-icon">📋</span>
        Gestion des thèmes
      </button>
      <button 
        @click="currentSection = 'theme-order'" 
        :class="['nav-button', { active: currentSection === 'theme-order' }]"
      >
        <span class="nav-icon">🔢</span>
        Ordre des thèmes
      </button>
      <button 
        @click="currentSection = 'orthophonistes'" 
        :class="['nav-button', { active: currentSection === 'orthophonistes' }]"
      >
        <span class="nav-icon">👨‍⚕️</span>
        Gestion des orthophonistes
      </button>
      <button 
        @click="currentSection = 'parents'" 
        :class="['nav-button', { active: currentSection === 'parents' }]"
      >
        <span class="nav-icon">👨‍👩‍👧‍👦</span>
        Gestion des parents
      </button>
      <button 
        @click="currentSection = 'patients'" 
        :class="['nav-button', { active: currentSection === 'patients' }]"
      >
        <span class="nav-icon">👶</span>
        Patients sans orthophoniste
      </button>
    </div>

    <div class="admin-sections">
      <!-- Section des thèmes -->
      <section v-if="currentSection === 'themes'" class="admin-section">
        <h2>Thèmes en attente d'approbation</h2>
        <div v-if="loading" class="loading">Chargement...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else-if="pendingThemes.length === 0" class="empty-state">
          Aucun thème en attente d'approbation
        </div>
        <div v-else class="themes-list">
          <div v-for="theme in pendingThemes" :key="theme.id" class="theme-card">
            <h3>{{ theme.name }}</h3>
            <p>{{ theme.description }}</p>
            <p>Créé par: {{ theme.creator?.email }}</p>
            <div class="card-actions">
              <button @click="approveTheme(theme.id)" class="btn-approve">
                Approuver
              </button>
              <button @click="rejectTheme(theme.id)" class="btn-reject">
                Rejeter
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Section de l'ordre des thèmes -->
      <section v-if="currentSection === 'theme-order'" class="admin-section">
        <ThemeOrderManager />
      </section>

      <!-- Section des orthophonistes -->
      <section v-if="currentSection === 'orthophonistes'" class="admin-section">
        <OrthophonisteManagement ref="orthophonisteManagementRef" />
      </section>

      <!-- Section des parents -->
      <section v-if="currentSection === 'parents'" class="admin-section">
        <ParentManagement ref="parentManagementRef" />
      </section>

      <!-- Section des patients sans orthophoniste -->
      <section v-if="currentSection === 'patients'" class="admin-section">
        <UnassignedPatients ref="unassignedPatientsRef" />
      </section>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import OrthophonisteManagement from '@/components/OrthophonisteManagement.vue';
import ParentManagement from '@/components/ParentManagement.vue';
import UnassignedPatients from '@/components/UnassignedPatients.vue';
import ThemeOrderManager from '@/components/ThemeOrderManager.vue';

export default {
  name: 'AdminPanel',
  components: {
    OrthophonisteManagement,
    ParentManagement,
    UnassignedPatients,
    ThemeOrderManager
  },
  setup() {
    const store = useStore();
    const loading = ref(false);
    const error = ref('');
    const currentSection = ref('themes'); // Section active par défaut
    const orthophonisteManagementRef = ref(null);
    const unassignedPatientsRef = ref(null);

    const pendingThemes = computed(() => {
      const themes = store.state.themes.themes || [];
      return themes.filter(theme => theme.status === 'pending');
    });

    const approveTheme = async (themeId) => {
      try {
        loading.value = true;
        await store.dispatch('themes/approveTheme', themeId);
        await store.dispatch('themes/fetchThemes');
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    const rejectTheme = async (themeId) => {
      try {
        loading.value = true;
        await store.dispatch('themes/rejectTheme', themeId);
        await store.dispatch('themes/fetchThemes');
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      try {
        loading.value = true;
        await store.dispatch('themes/fetchThemes');
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    });

    // Watcher pour déclencher le chargement des données selon la section
    watch(currentSection, (newSection) => {
      if (newSection === 'orthophonistes') {
        // Déclencher le chargement des orthophonistes
        setTimeout(() => {
          if (orthophonisteManagementRef.value && orthophonisteManagementRef.value.loadOrthophonistes) {
            orthophonisteManagementRef.value.loadOrthophonistes();
          }
        }, 100);
      } else if (newSection === 'patients') {
        // Déclencher le chargement des patients non assignés
        setTimeout(() => {
          if (unassignedPatientsRef.value && unassignedPatientsRef.value.loadUnassignedPatients) {
            unassignedPatientsRef.value.loadUnassignedPatients();
          }
        }, 100);
      }
    });

          return {
        currentSection,
        loading,
        error,
        pendingThemes,
        approveTheme,
        rejectTheme,
        orthophonisteManagementRef,
        unassignedPatientsRef
      };
  }
};
</script>

<style scoped>
.admin-panel {
  padding: 0.5rem;
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 80px; /* Espace pour la navbar fixe */
  overflow-x: hidden; /* Empêcher le défilement horizontal */
}

@media (max-width: 768px) {
  .admin-panel {
    padding: 0.25rem;
    padding-top: 70px;
    max-width: 100%;
  }
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

.admin-navigation {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
  overflow-x: auto; /* Permettre le défilement horizontal sur mobile */
  -webkit-overflow-scrolling: touch;
}

@media (max-width: 768px) {
  .admin-navigation {
    gap: 0.5rem;
    padding: 0 0.25rem;
    margin-bottom: 1rem;
  }
}

.nav-button {
  flex: 1;
  padding: 1rem;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #666;
  white-space: nowrap; /* Empêcher le retour à la ligne */
  min-width: fit-content; /* Largeur minimale */
}

@media (max-width: 768px) {
  .nav-button {
    flex: none; /* Ne pas étirer sur mobile */
    min-width: 120px;
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
    gap: 0.25rem;
  }
}

.nav-button:hover {
  border-color: #4B95DE;
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(75, 149, 222, 0.15);
}

.nav-button.active {
  border-color: #4B95DE;
  background: linear-gradient(135deg, #4B95DE 0%, #7FD1F4 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(75, 149, 222, 0.3);
}

.nav-icon {
  font-size: 1.2rem;
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

.themes-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 0.75rem;
  padding: 0 0.25rem;
}

.theme-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.theme-card h3 {
  font-size: 0.95rem;
  line-height: 1.2;
  margin: 0;
  color: #2C3E50;
}

.theme-card p {
  font-size: 0.8rem;
  margin: 0.25rem 0;
  color: #666;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-approve, .btn-reject {
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  text-align: center;
}

.btn-approve {
  background-color: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
}

.btn-reject {
  background-color: rgba(244, 67, 54, 0.1);
  color: #c62828;
}

@media (min-width: 768px) {
  .admin-panel {
    padding-top: 90px; /* Plus d'espace sur desktop */
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

  .themes-list {
    padding: 0;
    gap: 1rem;
  }

  .theme-card {
    padding: 1rem;
  }

  .theme-card h3 {
    font-size: 1.1rem;
  }

  .theme-card p {
    font-size: 0.9rem;
  }

  .card-actions {
    gap: 1rem;
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
  padding: 1.5rem;
  color: #666;
  font-size: 0.9rem;
}

.error {
  color: #f44336;
}
</style> 