<template>
  <div class="dashboard-ortho">
    <div class="header">
      <h1>Dashboard Orthophoniste</h1>
      <button @click="goToThemes" class="themes-button">
        ← Retour aux thèmes
      </button>
    </div>

    <!-- Navigation des sections -->
    <div class="section-nav">
      <button 
        @click="currentSection = 'patients-list'" 
        :class="['nav-button', { active: currentSection === 'patients-list' }]"
      >
        📋 Liste des patients
      </button>
      <button 
        @click="currentSection = 'patient-progress'" 
        :class="['nav-button', { active: currentSection === 'patient-progress' }]"
      >
        📊 Suivi de progression
      </button>
    </div>

    <!-- Section Liste des patients -->
    <div v-if="currentSection === 'patients-list'" class="section-content">
      <!-- Statistiques globales -->
      <div class="stats-summary">
        <div class="stat-box">
          <p class="stat-label">Total</p>
          <p class="stat-value">{{ patients.length }}</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Actifs</p>
          <p class="stat-value text-green-600">{{ activeCount }}</p>
        </div>
        <div class="stat-box">
          <p class="stat-label">Expirés</p>
          <p class="stat-value text-red-600">{{ expiredCount }}</p>
        </div>
      </div>

      <div class="content">
        <div v-if="loading" class="loading">Chargement des patients...</div>

        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
          <button @click="fetchPatients" class="retry-button">Réessayer</button>
        </div>

        <div v-else-if="patients.length" class="patient-list">
          <div
            v-for="(patient, index) in patients"
            :key="patient.id"
            class="patient-card"
          >
            <h3>{{ patient.firstName }} {{ patient.lastName }}</h3>
            <p>Date de naissance : {{ formatDate(patient.birthDate) }}</p>
            <p v-if="patient.parent?.email" class="parent-email">
              <strong>Parent :</strong> {{ patient.parent.email }}
            </p>
            <p>
              Abonnement :
              <span :class="statusColor(patient.subscriptionStatus)">
                {{ patient.subscriptionStatus }}
              </span>
            </p>
            <p v-if="patient.subscriptionEndDate" class="sub-date">
              Jusqu'au {{ formatDate(patient.subscriptionEndDate) }}
            </p>
            <p>
              Sessions terminées :
              <strong>{{ patient.completedSessions }}</strong>
            </p>
            <button @click="openDetails(patient)" class="detail-button">Détail</button>
            <hr v-if="index < patients.length - 1" class="divider" />
          </div>
        </div>

        <div v-else class="empty-state">Aucun patient trouvé.</div>
      </div>
    </div>

    <!-- Section Suivi de progression -->
    <div v-if="currentSection === 'patient-progress'" class="section-content">
      <ThemeAccessManager />
    </div>
  </div>

  <!-- POP-UP des détails de complétion -->
  <div v-if="showModal && selectedPatient" class="modal-overlay">
    <div class="modal">
      <h2>Thèmes complétés par {{ selectedPatient.firstName }} {{ selectedPatient.lastName }}</h2>
      <ul>
        <li v-for="completion in selectedPatient.completions" :key="completion.id">
          <span>✔️</span> {{ completion.Theme?.name || 'Thème inconnu' }} – {{ formatDate(completion.createdAt) }}
        </li>
      </ul>
      <button @click="closeModal" class="close-button">Fermer</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ThemeAccessManager from '@/components/ThemeAccessManager.vue';

const selectedPatient = ref(null);
const showModal = ref(false);
const currentSection = ref('patients-list');
const store = useStore();
const router = useRouter();
const patients = ref([]);
const loading = ref(false);
const error = ref(null);

const currentUser = computed(() => store.getters['auth/currentUser']);

const goToThemes = () => {
  router.push('/themes');
};

const openDetails = (patient) => {
  selectedPatient.value = patient;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedPatient.value = null;
};

const fetchPatients = async () => {
  if (!currentUser.value) {
    error.value = 'Utilisateur non connecté';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const response = await store.dispatch('patients/fetchPatients');

    console.log('Patients reçus du backend :', response);

    patients.value = response.map(patient => {
      const completions = patient.parent?.themeCompletions || [];
      return {
        ...patient,
        completions, // ← pour la modale
        completedSessions: completions.length // ← compteur
      };
    });

    console.log('Patients enrichis :', patients.value);
  } catch (err) {
    error.value = err.message || 'Erreur lors du chargement des patients';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPatients);

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR');
}

function statusColor(status) {
  if (status === 'active') return 'status active';
  if (status === 'expired') return 'status expired';
  return 'status inactive';
}

const activeCount = computed(() =>
  patients.value.filter(p => p.subscriptionStatus === 'active').length
);

const expiredCount = computed(() =>
  patients.value.filter(p => p.subscriptionStatus === 'expired').length
);
</script>

<style scoped>
.dashboard-ortho {
  padding: 0.5rem;
  max-width: 1200px;
  margin: 70px auto 0;
}

.header {
  padding: 0 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.themes-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.themes-button:hover {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-2px);
}

.section-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
}

.nav-button {
  background: #f8f9fa;
  border: 2px solid #E0E0E0;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #666;
}

.nav-button:hover {
  background: #e9ecef;
  border-color: #4B95DE;
}

.nav-button.active {
  background: #4B95DE;
  border-color: #4B95DE;
  color: white;
}

.section-content {
  padding: 0 0.5rem;
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-box {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #E0E0E0;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  color: #2C3E50;
}

.text-green-600 {
  color: #16a34a;
}

.text-red-600 {
  color: #dc2626;
}

.content {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #f44336;
}

.retry-button {
  background: #4B95DE;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: 500;
}

.retry-button:hover {
  background: #3a7bd5;
}

.patient-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.patient-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #E0E0E0;
  transition: all 0.3s ease;
}

.patient-card:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.patient-card h3 {
  margin: 0 0 1rem 0;
  color: #2C3E50;
  font-size: 1.2rem;
}

.patient-card p {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.parent-email {
  color: #4B95DE;
  font-weight: 500;
}

.sub-date {
  color: #666;
  font-style: italic;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status.active {
  background: #E8F5E8;
  color: #2E7D32;
}

.status.expired {
  background: #FFEBEE;
  color: #C62828;
}

.status.inactive {
  background: #FFF3E0;
  color: #EF6C00;
}

.detail-button {
  background: #4B95DE;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.detail-button:hover {
  background: #3a7bd5;
  transform: translateY(-1px);
}

.divider {
  border: none;
  border-top: 1px solid #E0E0E0;
  margin: 1rem 0;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-style: italic;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal h2 {
  margin: 0 0 1.5rem 0;
  color: #2C3E50;
  font-size: 1.3rem;
}

.modal ul {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.modal li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #E0E0E0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal li:last-child {
  border-bottom: none;
}

.close-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  width: 100%;
}

.close-button:hover {
  background: #5a6268;
}

@media (max-width: 768px) {
  .dashboard-ortho {
    padding: 0.25rem;
    margin-top: 60px;
  }

  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .section-nav {
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-button {
    text-align: center;
  }

  .stats-summary {
    grid-template-columns: 1fr;
  }

  .content {
    padding: 1rem;
  }

  .patient-card {
    padding: 1rem;
  }
}
</style>
