<template>
  <div class="admin-theme-access-manager">
    <div class="header">
      <h2>Suivi de progression des patients</h2>
      <p class="header-description">Suivre l'avancée des patients dans le déblocage des thèmes par ordre de série</p>
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

      <!-- Section de suivi de progression -->
      <div v-if="selectedPatientId && selectedPatient" class="progress-section">
        <div class="patient-summary">
          <h3>Patient sélectionné : {{ selectedPatient.firstName }} {{ selectedPatient.lastName }}</h3>
          <p>Parent : {{ selectedPatient.User?.firstName }} {{ selectedPatient.User?.lastName }}</p>
        </div>

        <div class="progress-overview">
          <div class="progress-stats">
            <div class="stat-card">
              <h4>Thèmes débloqués</h4>
              <div class="stat-number">{{ unlockedThemes.length }}</div>
              <div class="stat-label">sur {{ totalThemes }} thèmes</div>
            </div>
            <div class="stat-card">
              <h4>Progression globale</h4>
              <div class="stat-number">{{ progressPercentage }}%</div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
              </div>
            </div>
            <div class="stat-card">
              <h4>Prochain thème</h4>
              <div class="stat-number">{{ nextTheme ? nextTheme.name : 'Aucun' }}</div>
              <div class="stat-label">{{ nextTheme ? 'En attente de déblocage' : 'Tous débloqués' }}</div>
            </div>
          </div>

          <div class="themes-progress">
            <h4>Détail de la progression par thème</h4>
            <div class="search-themes">
              <input 
                v-model="themeSearchQuery" 
                type="text" 
                placeholder="Rechercher un thème..."
                @input="filterThemes"
                class="search-input"
              >
            </div>
            <div class="themes-progress-list">
              <div v-for="theme in filteredThemesProgress" :key="theme.id" class="theme-progress-card">
                <div class="theme-info">
                  <h5>{{ theme.name }}</h5>
                  <p>{{ theme.description || 'Aucune description' }}</p>
                  <div class="theme-meta">
                    <span :class="['status-badge', `status-${theme.status}`]">
                      {{ getThemeStatusText(theme.status) }}
                    </span>
                    <span class="order-badge">Ordre: {{ theme.order || 'N/A' }}</span>
                  </div>
                </div>
                <div class="theme-progress">
                  <div class="progress-indicator">
                    <div v-if="theme.isUnlocked" class="unlocked-indicator">
                      <span class="unlocked-icon">✓</span>
                      <span class="unlocked-text">Débloqué</span>
                    </div>
                    <div v-else class="locked-indicator">
                      <span class="locked-icon">🔒</span>
                      <span class="locked-text">Verrouillé</span>
                    </div>
                  </div>
                  <div v-if="theme.isUnlocked" class="unlock-date">
                    Débloqué le {{ formatDate(theme.unlockDate) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Message d'instruction -->
      <div v-if="!selectedPatientId" class="instruction">
        <div class="instruction-content">
          <span class="instruction-icon">👆</span>
          <p>Sélectionnez un patient ci-dessus pour voir sa progression dans les thèmes</p>
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
    const patientSearchQuery = ref('')
    const themeSearchQuery = ref('')
    const filteredPatients = ref([])
    const themesProgress = ref([])
    const filteredThemesProgress = ref([])

    const selectedPatient = computed(() => {
      return patients.value.find(p => p.id === selectedPatientId.value)
    })

    const unlockedThemes = computed(() => {
      return themesProgress.value.filter(theme => theme.isUnlocked)
    })

    const totalThemes = computed(() => {
      return themesProgress.value.length
    })

    const progressPercentage = computed(() => {
      if (totalThemes.value === 0) return 0
      return Math.round((unlockedThemes.value.length / totalThemes.value) * 100)
    })

    const nextTheme = computed(() => {
      const lockedThemes = themesProgress.value.filter(theme => !theme.isUnlocked && theme.status === 'approved')
      if (lockedThemes.length === 0) return null
      
      // Retourner le thème verrouillé avec l'ordre le plus bas
      return lockedThemes.reduce((lowest, theme) => {
        if (!lowest || (theme.order && theme.order < lowest.order)) {
          return theme
        }
        return lowest
      }, null)
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
                userId: parent.id,
                User: parent
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
        filteredThemesProgress.value = themesProgress.value
        return
      }

      const query = themeSearchQuery.value.toLowerCase()
      filteredThemesProgress.value = themesProgress.value.filter(theme => 
        theme.name.toLowerCase().includes(query) ||
        (theme.description && theme.description.toLowerCase().includes(query))
      )
    }

    const selectPatient = async (patientId) => {
      selectedPatientId.value = patientId
      await loadPatientProgress()
    }

    const loadPatientProgress = async () => {
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

        // Créer la liste de progression des thèmes
        themesProgress.value = allThemes.map(theme => {
          const isUnlocked = parentThemes.some(pt => pt.id === theme.id)
          const unlockDate = isUnlocked ? 
            parentThemes.find(pt => pt.id === theme.id)?.createdAt || new Date() : 
            null

          return {
            ...theme,
            isUnlocked,
            unlockDate,
            order: theme.order || 999 // Ordre par défaut si non défini
          }
        }).sort((a, b) => (a.order || 999) - (b.order || 999))

        filteredThemesProgress.value = themesProgress.value
        
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors du chargement de la progression'
      } finally {
        loading.value = false
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

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
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
      patientSearchQuery,
      themeSearchQuery,
      filteredPatients,
      themesProgress,
      filteredThemesProgress,
      unlockedThemes,
      totalThemes,
      progressPercentage,
      nextTheme,
      filterPatients,
      filterThemes,
      selectPatient,
      calculateAge,
      getSubscriptionStatusText,
      getThemeStatusText,
      formatDate
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

.progress-section {
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

.progress-overview {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #E0E0E0;
}

.stat-card h4 {
  margin: 0 0 1rem 0;
  color: #2C3E50;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #4B95DE;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #E0E0E0;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.3s ease;
}

.themes-progress {
  min-height: 300px;
}

.themes-progress h4 {
  margin: 0 0 1rem 0;
  color: #2C3E50;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #E0E0E0;
}

.search-themes {
  margin-bottom: 1rem;
}

.themes-progress-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 500px;
  overflow-y: auto;
  padding: 0.5rem;
}

.theme-progress-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #E0E0E0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.theme-progress-card:hover {
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

.theme-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.status-badge {
  display: inline-block;
  padding: 0.2rem 0.4rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending { background: #FFF3E0; color: #EF6C00; }
.status-approved { background: #E8F5E8; color: #2E7D32; }
.status-rejected { background: #FFEBEE; color: #C62828; }

.order-badge {
  display: inline-block;
  padding: 0.2rem 0.4rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  background: #E3F2FD;
  color: #1976D2;
}

.theme-progress {
  text-align: center;
  min-width: 120px;
}

.progress-indicator {
  margin-bottom: 0.5rem;
}

.unlocked-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #4CAF50;
  font-weight: 600;
}

.unlocked-icon {
  font-size: 1.2rem;
  background: #E8F5E8;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.locked-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #666;
  font-weight: 600;
}

.locked-icon {
  font-size: 1.2rem;
}

.unlock-date {
  font-size: 0.7rem;
  color: #666;
  font-style: italic;
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

  .progress-stats {
    grid-template-columns: 1fr;
  }

  .theme-progress-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .theme-meta {
    flex-wrap: wrap;
  }
}
</style> 