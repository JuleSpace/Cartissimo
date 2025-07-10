<template>
  <div class="unassigned-patients">
    <div class="patients-header">
      <h2>Patients sans orthophoniste</h2>
      <div class="patients-count">
        {{ unassignedPatients.length }} patient(s) non assigné(s)
      </div>
    </div>

    <!-- Liste des patients -->
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="unassignedPatients.length === 0" class="empty-state">
      <div class="empty-icon">🎉</div>
      <h3>Tous les patients sont assignés !</h3>
      <p>Il n'y a actuellement aucun patient sans orthophoniste.</p>
    </div>
    <div v-else class="patients-table-container">
      <table class="patients-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Âge</th>
            <th>Parent</th>
            <th>Date d'ajout</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in unassignedPatients" :key="patient.id">
            <td>
              <div class="patient-info">
                <strong>{{ patient.firstName }} {{ patient.lastName }}</strong>
              </div>
            </td>
            <td>{{ calculateAge(patient.birthDate) }} ans</td>
            <td>
              <div class="parent-info">
                <div>{{ patient.parent?.firstName }} {{ patient.parent?.lastName }}</div>
                <div class="parent-email">{{ patient.parent?.email || patient.parentEmail }}</div>
              </div>
            </td>
            <td>{{ formatDate(patient.createdAt) }}</td>
            <td>
              <button @click="showAssignModal(patient)" class="btn-assign">
                <span class="icon">👨‍⚕️</span>
                Assigner
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal d'assignation -->
    <div v-if="showAssignPatientModal" class="modal-overlay" @click="closeAssignModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Assigner {{ selectedPatient?.firstName }} {{ selectedPatient?.lastName }}</h3>
          <button @click="closeAssignModal" class="btn-close">✕</button>
        </div>
        
        <form @submit.prevent="assignPatient" class="modal-form">
          <div class="form-group">
            <label>Orthophoniste *</label>
            <select v-model="selectedOrthophonisteId" required>
              <option value="">Sélectionner un orthophoniste</option>
              <option 
                v-for="ortho in orthophonistes" 
                :key="ortho.id" 
                :value="ortho.id"
              >
                {{ ortho.firstName }} {{ ortho.lastName }} ({{ ortho.patients?.length || 0 }} patients)
              </option>
            </select>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeAssignModal" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save" :disabled="assignLoading">
              {{ assignLoading ? 'Assignation...' : 'Assigner' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'UnassignedPatients',
  setup() {
    const unassignedPatients = ref([])
    const orthophonistes = ref([])
    const loading = ref(false)
    const assignLoading = ref(false)
    const error = ref('')
    
    // Modal
    const showAssignPatientModal = ref(false)
    const selectedPatient = ref(null)
    const selectedOrthophonisteId = ref('')

    // Charger les patients non assignés
    const loadUnassignedPatients = async () => {
      try {
        console.log('Chargement des patients non assignés...');
        loading.value = true
        error.value = ''
        const response = await axios.get('/ortho/patients/unassigned')
        console.log('Patients non assignés reçus:', response.data);
        unassignedPatients.value = response.data
      } catch (err) {
        console.error('Erreur lors du chargement des patients non assignés:', err);
        error.value = err.response?.data?.message || 'Erreur lors du chargement'
      } finally {
        loading.value = false
      }
    }

    // Charger les orthophonistes
    const loadOrthophonistes = async () => {
      try {
        const response = await axios.get('/ortho')
        orthophonistes.value = response.data
      } catch (err) {
        console.error('Erreur lors du chargement des orthophonistes:', err);
      }
    }

    // Afficher le modal d'assignation
    const showAssignModal = (patient) => {
      selectedPatient.value = patient
      selectedOrthophonisteId.value = ''
      showAssignPatientModal.value = true
      
      // Charger les orthophonistes si pas déjà fait
      if (orthophonistes.value.length === 0) {
        loadOrthophonistes()
      }
    }

    // Assigner un patient
    const assignPatient = async () => {
      try {
        assignLoading.value = true
        await axios.put(`/ortho/patients/${selectedPatient.value.id}/assign`, {
          orthophonisteId: selectedOrthophonisteId.value
        })
        
        // Recharger les patients non assignés
        await loadUnassignedPatients()
        closeAssignModal()
      } catch (err) {
        console.error('Erreur lors de l\'assignation:', err);
        error.value = err.response?.data?.message || 'Erreur lors de l\'assignation'
      } finally {
        assignLoading.value = false
      }
    }

    // Fermer le modal d'assignation
    const closeAssignModal = () => {
      showAssignPatientModal.value = false
      selectedPatient.value = null
      selectedOrthophonisteId.value = ''
    }

    // Calculer l'âge à partir de la date de naissance
    const calculateAge = (birthDate) => {
      if (!birthDate) return 'N/A'
      const today = new Date()
      const birth = new Date(birthDate)
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      return age
    }

    // Formater la date
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR')
    }

    onMounted(() => {
      console.log('Composant UnassignedPatients monté');
      loadUnassignedPatients()
    })

    return {
      unassignedPatients,
      orthophonistes,
      loading,
      assignLoading,
      error,
      showAssignPatientModal,
      selectedPatient,
      selectedOrthophonisteId,
      loadUnassignedPatients,
      showAssignModal,
      assignPatient,
      closeAssignModal,
      calculateAge,
      formatDate
    }
  }
}
</script>

<style scoped>
.unassigned-patients {
  padding: 1rem;
}

.patients-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .patients-header {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
}

.patients-header h2 {
  margin: 0;
  color: #2C3E50;
}

.patients-count {
  background: linear-gradient(135deg, #4B95DE 0%, #7FD1F4 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.error {
  color: #D32F2F;
  background: #FFEBEE;
  border-radius: 8px;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: #F8F9FA;
  border-radius: 12px;
  margin: 2rem 0;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2C3E50;
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: #666;
  margin: 0;
}

.patients-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  overflow-x: auto; /* Permettre le défilement horizontal sur mobile */
}

@media (max-width: 768px) {
  .patients-table-container {
    border-radius: 8px;
    margin: 0 -0.25rem; /* Compenser le padding du container */
  }
}

.patients-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px; /* Largeur minimale pour éviter que le tableau soit trop compressé */
}

@media (max-width: 768px) {
  .patients-table {
    min-width: 500px;
  }
}

.patients-table th {
  background: #F8F9FA;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2C3E50;
  border-bottom: 1px solid #E0E0E0;
}

.patients-table td {
  padding: 1rem;
  border-bottom: 1px solid #F0F0F0;
  vertical-align: top;
}

.patients-table tr:hover {
  background: #F8F9FA;
}

.patient-info strong {
  color: #2C3E50;
}

.parent-info {
  line-height: 1.4;
}

.parent-email {
  font-size: 0.9rem;
  color: #666;
}

.btn-assign {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-assign:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

/* Styles des modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h3 {
  margin: 0;
  color: #2C3E50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: #F0F0F0;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #2C3E50;
}

.form-group select {
  padding: 0.75rem;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group select:focus {
  outline: none;
  border-color: #4B95DE;
  box-shadow: 0 0 0 3px rgba(75, 149, 222, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-cancel, .btn-save {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #F5F5F5;
  color: #666;
}

.btn-cancel:hover {
  background: #E0E0E0;
}

.btn-save {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: white;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 