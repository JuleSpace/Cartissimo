<template>
  <div class="dashboard-ortho">
    <div class="header">
      <h1>Liste de vos Patients</h1>
    </div>

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
          <p>
            Abonnement :
            <span :class="statusColor(patient.subscriptionStatus)">
              {{ patient.subscriptionStatus }}
            </span>
          </p>
          <p v-if="patient.subscriptionEndDate" class="sub-date">
            Jusqu’au {{ formatDate(patient.subscriptionEndDate) }}
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

const selectedPatient = ref(null);
const showModal = ref(false);
const store = useStore();
const patients = ref([]);
const loading = ref(false);
const error = ref(null);

const currentUser = computed(() => store.getters['auth/currentUser']);

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
}

.header h1 {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.stats-summary {
  display: flex;
  justify-content: flex-start;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
  flex-wrap: wrap;
}

.stat-box {
  background: #f1f5f9;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-width: 100px;
  text-align: center;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 600;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.patient-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.patient-card {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.patient-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #2C3E50;
}

.patient-card p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #444;
}

.status {
  font-weight: 600;
}

.status.active {
  color: #2e7d32;
}

.status.expired {
  color: #c62828;
}

.status.inactive {
  color: #888;
}

.sub-date {
  font-size: 0.8rem;
  color: #666;
}

.loading,
.error,
.empty-state {
  text-align: center;
  color: #666;
  font-size: 0.95rem;
}

.error {
  color: #e53935;
}

.retry-button {
  margin-top: 1rem;
  background-color: #4B95DE;
  color: white;
  padding: 0.5rem 1rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.divider {
  margin-top: 1rem;
  border: none;
  border-top: 1px solid #ddd;
}

@media (min-width: 768px) {
  .patient-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.close-button {
  margin-top: 1rem;
  background: #e53935;
  color: white;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.detail-button {
  margin-top: 0.5rem;
  background-color: #4B95DE; /* Bleu doux */
  color: white;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.detail-button:hover {
  background-color: #3a7cc1; /* Légèrement plus foncé au survol */
}


</style>
