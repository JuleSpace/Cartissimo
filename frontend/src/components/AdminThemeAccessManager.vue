<template>
  <div class="admin-theme-access-manager">
    <div class="header">
      <h2>Gestion des accès aux thèmes - Patients</h2>
      <p class="header-description">Gérer l'accès aux thèmes pour tous les patients du système</p>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="content">
      <!-- Section de sélection -->
      <div class="selection-section">
        <!-- Sélection du patient -->
        <div class="selector-group">
          <h3>1. Sélectionner un patient</h3>
          <div class="patient-search">
            <input 
              v-model="patientSearchQuery" 
              type="text" 
              placeholder="Rechercher par nom du patient ou du parent..."
              @input="filterPatients"
              class="search-input"
            >
          </div>
          <div class="patients-list">
            <div 
              v-for="patient in filteredPatients" 
              :key="patient.id" 
              :class="['patient-item', { selected: selectedPatientId === patient.id }]"
              @click="selectPatient(patient.id)"
            >
              <div class="patient-info">
                <h4>{{ patient.firstName }} {{ patient.lastName }}</h4>
                <p>Parent: {{ patient.User?.firstName }} {{ patient.User?.lastName }} ({{ patient.User?.email }})</p>
                <p>Age: {{ calculateAge(patient.birthDate) }} ans</p>
              </div>
              <div class="patient-status">
                <span :class="['subscription-badge', `status-${patient.subscriptionStatus}`]">
                  {{ getSubscriptionStatusText(patient.subscriptionStatus) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section de gestion des thèmes -->
      <div v-if="selectedPatientId && selectedPatient" class="themes-section">
        <div class="patient-summary">
          <h3>Patient sélectionné : {{ selectedPatient.firstName }} {{ selectedPatient.lastName }}</h3>
          <p>Parent : {{ selectedPatient.User?.firstName }} {{ selectedPatient.User?.lastName }}</p>
        </div>

        <div class="themes-management">
          <div class="available-themes">
            <h4>Thèmes disponibles ({{ availableThemes.length }})</h4>
            <div class="search-themes">
              <input 
                v-model="themeSearchQuery" 
                type="text" 
                placeholder="Rechercher un thème..."
                @input="filterThemes"
                class="search-input"
              >
            </div>
            <div v-if="filteredAvailableThemes.length === 0" class="empty-list">
              Aucun thème disponible
            </div>
            <div v-else class="themes-grid">
              <div v-for="theme in filteredAvailableThemes" :key="theme.id" class="theme-card available">
                <div class="theme-info">
                  <h5>{{ theme.name }}</h5>
                  <p>{{ theme.description || 'Aucune description' }}</p>
                  <span :class="['status-badge', `status-${theme.status}`]">
                    {{ getThemeStatusText(theme.status) }}
                  </span>
                </div>
                <button 
                  @click="grantAccess(theme.id)" 
                  class="btn-grant"
                  :disabled="actionLoading[theme.id]"
                >
                  {{ actionLoading[theme.id] ? 'Attribution...' : '✓ Accorder' }}
                </button>
              </div>
            </div>
          </div>

          <div class="granted-themes">
            <h4>Thèmes accordés ({{ grantedThemes.length }})</h4>
            <div v-if="grantedThemes.length === 0" class="empty-list">
              Aucun thème accordé
            </div>
            <div v-else class="themes-grid">
              <div v-for="theme in grantedThemes" :key="theme.id" class="theme-card granted">
                <div class="theme-info">
                  <h5>{{ theme.name }}</h5>
                  <p>{{ theme.description || 'Aucune description' }}</p>
                  <span :class="['status-badge', `status-${theme.status}`]">
                    {{ getThemeStatusText(theme.status) }}
                  </span>
                </div>
                <button 
                  @click="revokeAccess(theme.id)" 
                  class="btn-revoke"
                  :disabled="actionLoading[theme.id]"
                >
                  {{ actionLoading[theme.id] ? 'Révocation...' : '✗ Révoquer' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message d'instruction -->
      <div v-if="!selectedPatientId" class="instruction">
        <div class="instruction-content">
          <span class="instruction-icon">👆</span>
          <p>Sélectionnez un patient ci-dessus pour gérer ses accès aux thèmes</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

export default {
  name: 'AdminThemeAccessManager',
  setup() {
    const store = useStore()
    const loading = ref(false)
    const error = ref('')
    const patients = ref([])
    const selectedPatientId = ref('')
    const availableThemes = ref([])
    const grantedThemes = ref([])
    const actionLoading = ref({})
    const patientSearchQuery = ref('')
    const themeSearchQuery = ref('')

    const filteredPatients = ref([])
    const filteredAvailableThemes = ref([])

    const selectedPatient = computed(() => {
      return patients.value.find(p => p.id === selectedPatientId.value)
    })

    const loadPatients = async () => {
      try {
        loading.value = true
        error.value = ''
        
        const token = localStorage.getItem('token')
        const response = await axios.get('/users/parents', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        // Aplatir la liste des patients avec leurs parents
        const allPatients = []
        response.data.forEach(parent => {
          if (parent.patients && parent.patients.length > 0) {
            parent.patients.forEach(patient => {
              allPatients.push({
                ...patient,
                userId: parent.id,  // Ajouter l'ID du parent
                User: parent  // Ajouter les infos du parent
              })
            })
          }
        })
        
        patients.value = allPatients
        filteredPatients.value = allPatients
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors du chargement des patients'
      } finally {
        loading.value = false
      }
    }

    const filterPatients = () => {
      if (!patientSearchQuery.value) {
        filteredPatients.value = patients.value
        return
      }

      const query = patientSearchQuery.value.toLowerCase()
      filteredPatients.value = patients.value.filter(patient => 
        patient.firstName.toLowerCase().includes(query) ||
        patient.lastName.toLowerCase().includes(query) ||
        patient.User?.firstName.toLowerCase().includes(query) ||
        patient.User?.lastName.toLowerCase().includes(query) ||
        patient.User?.email.toLowerCase().includes(query)
      )
    }

    const filterThemes = () => {
      if (!themeSearchQuery.value) {
        filteredAvailableThemes.value = availableThemes.value
        return
      }

      const query = themeSearchQuery.value.toLowerCase()
      filteredAvailableThemes.value = availableThemes.value.filter(theme => 
        theme.name.toLowerCase().includes(query) ||
        (theme.description && theme.description.toLowerCase().includes(query))
      )
    }

    const selectPatient = async (patientId) => {
      selectedPatientId.value = patientId
      await loadPatientThemes()
    }

    const loadPatientThemes = async () => {
      if (!selectedPatientId.value) return

      try {
        loading.value = true
        error.value = ''
        
        const patient = patients.value.find(p => p.id === selectedPatientId.value)
        if (!patient) return

        // Charger tous les thèmes
        await store.dispatch('themes/fetchThemes')
        const allThemes = store.state.themes.themes

        // Charger les thèmes accordés au parent du patient
        const token = localStorage.getItem('token')
        const response = await axios.get(`/themes/user/${patient.userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        const parentThemes = response.data

        // Filtrer les thèmes disponibles et accordés
        grantedThemes.value = allThemes.filter(theme => 
          parentThemes.some(pt => pt.id === theme.id)
        )
        
        availableThemes.value = allThemes.filter(theme => 
          !parentThemes.some(pt => pt.id === theme.id) &&
          theme.status === 'approved'
        )

        filteredAvailableThemes.value = availableThemes.value
        
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors du chargement des thèmes'
      } finally {
        loading.value = false
      }
    }

    const grantAccess = async (themeId) => {
      try {
        actionLoading.value[themeId] = true
        
        const token = localStorage.getItem('token')
        await axios.post('/themes/grant-access', {
          themeId,
          patientId: selectedPatientId.value
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        await loadPatientThemes()
        filterThemes()
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de l\'attribution de l\'accès'
      } finally {
        actionLoading.value[themeId] = false
      }
    }

    const revokeAccess = async (themeId) => {
      try {
        actionLoading.value[themeId] = true
        
        const token = localStorage.getItem('token')
        await axios.post('/themes/revoke-access', {
          themeId,
          patientId: selectedPatientId.value
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        await loadPatientThemes()
        filterThemes()
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de la révocation de l\'accès'
      } finally {
        actionLoading.value[themeId] = false
      }
    }

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

    const getSubscriptionStatusText = (status) => {
      const statusMap = {
        'active': 'Actif',
        'inactive': 'Inactif',
        'expired': 'Expiré',
        'payment_failed': 'Paiement échoué'
      }
      return statusMap[status] || 'Inconnu'
    }

    const getThemeStatusText = (status) => {
      const statusMap = {
        'pending': 'En attente',
        'approved': 'Approuvé',
        'rejected': 'Rejeté'
      }
      return statusMap[status] || status
    }

    onMounted(() => {
      loadPatients()
    })

    return {
      loading,
      error,
      patients,
      selectedPatientId,
      selectedPatient,
      availableThemes,
      grantedThemes,
      actionLoading,
      patientSearchQuery,
      themeSearchQuery,
      filteredPatients,
      filteredAvailableThemes,
      filterPatients,
      filterThemes,
      selectPatient,
      grantAccess,
      revokeAccess,
      calculateAge,
      getSubscriptionStatusText,
      getThemeStatusText
    }
  }
}
</script>

<style scoped>
.admin-theme-access-manager {
  padding: 1rem;
}

.header {
  margin-bottom: 2rem;
}

.header h2 {
  margin: 0 0 0.5rem 0;
  color: #2C3E50;
  font-size: 1.5rem;
}

.header-description {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.selection-section {
  margin-bottom: 2rem;
}

.selector-group h3 {
  color: #2C3E50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.patient-search {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4B95DE;
}

.patients-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  background: #f8f9fa;
}

.patient-item {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.patient-item:hover {
  border-color: #4B95DE;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(75, 149, 222, 0.15);
}

.patient-item.selected {
  border-color: #4B95DE;
  background: linear-gradient(135deg, #f0f7ff 0%, #e3f2fd 100%);
}

.patient-info h4 {
  margin: 0 0 0.25rem 0;
  color: #2C3E50;
  font-size: 1rem;
}

.patient-info p {
  margin: 0.25rem 0;
  font-size: 0.8rem;
  color: #666;
}

.subscription-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-active { background: #E8F5E8; color: #2E7D32; }
.status-inactive { background: #FFF3E0; color: #EF6C00; }
.status-expired { background: #FFEBEE; color: #C62828; }
.status-payment_failed { background: #FCE4EC; color: #AD1457; }

.themes-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.patient-summary {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #E0E0E0;
}

.patient-summary h3 {
  margin: 0 0 0.5rem 0;
  color: #2C3E50;
}

.patient-summary p {
  margin: 0;
  color: #666;
}

.themes-management {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.available-themes, .granted-themes {
  min-height: 300px;
}

.available-themes h4, .granted-themes h4 {
  margin: 0 0 1rem 0;
  color: #2C3E50;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #E0E0E0;
}

.search-themes {
  margin-bottom: 1rem;
}

.themes-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
}

.theme-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #E0E0E0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.theme-card.available {
  border-left: 4px solid #4CAF50;
}

.theme-card.granted {
  border-left: 4px solid #2196F3;
}

.theme-card:hover {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.theme-info {
  flex: 1;
}

.theme-info h5 {
  margin: 0 0 0.25rem 0;
  color: #2C3E50;
  font-size: 0.95rem;
}

.theme-info p {
  margin: 0.25rem 0;
  font-size: 0.8rem;
  color: #666;
  line-height: 1.3;
}

.status-badge {
  display: inline-block;
  padding: 0.2rem 0.4rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.25rem;
}

.status-pending { background: #FFF3E0; color: #EF6C00; }
.status-approved { background: #E8F5E8; color: #2E7D32; }
.status-rejected { background: #FFEBEE; color: #C62828; }

.btn-grant, .btn-revoke {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 90px;
}

.btn-grant {
  background: #4CAF50;
  color: white;
}

.btn-grant:hover:not(:disabled) {
  background: #45a049;
}

.btn-revoke {
  background: #f44336;
  color: white;
}

.btn-revoke:hover:not(:disabled) {
  background: #da190b;
}

.btn-grant:disabled, .btn-revoke:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-list {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

.instruction {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #E0E0E0;
}

.instruction-content {
  text-align: center;
}

.instruction-icon {
  display: block;
  font-size: 3rem;
  margin-bottom: 1rem;
}

.instruction p {
  margin: 0;
  color: #666;
  font-size: 1.1rem;
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
  .patients-list {
    grid-template-columns: 1fr;
  }

  .patient-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .themes-management {
    grid-template-columns: 1fr;
  }

  .theme-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style> 