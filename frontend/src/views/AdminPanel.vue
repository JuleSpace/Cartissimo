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
        @click="currentSection = 'theme-management'" 
        :class="['nav-button', { active: currentSection === 'theme-management' }]"
      >
        <span class="nav-icon">⚙️</span>
        Gestion des thèmes
      </button>
      <button 
        @click="currentSection = 'theme-access'" 
        :class="['nav-button', { active: currentSection === 'theme-access' }]"
      >
        <span class="nav-icon">🔐</span>
        Accès patients
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
      <!-- Section de gestion complète des thèmes -->
      <section v-if="currentSection === 'theme-management'" class="admin-section">
        <AdminThemeManager />
      </section>

      <!-- Section de gestion des accès patients -->
      <section v-if="currentSection === 'theme-access'" class="admin-section">
        <AdminThemeAccessManager />
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
import { ref, watch } from 'vue';
import OrthophonisteManagement from '@/components/OrthophonisteManagement.vue';
import ParentManagement from '@/components/ParentManagement.vue';
import UnassignedPatients from '@/components/UnassignedPatients.vue';
import ThemeOrderManager from '@/components/ThemeOrderManager.vue';
import AdminThemeManager from '@/components/AdminThemeManager.vue';
import AdminThemeAccessManager from '@/components/AdminThemeAccessManager.vue';

export default {
  name: 'AdminPanel',
  components: {
    OrthophonisteManagement,
    ParentManagement,
    UnassignedPatients,
    ThemeOrderManager,
    AdminThemeManager,
    AdminThemeAccessManager
  },
  setup() {
    const loading = ref(false);
    const error = ref('');
    const currentSection = ref('theme-management'); // Section active par défaut
    const orthophonisteManagementRef = ref(null);
    const unassignedPatientsRef = ref(null);



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