<template>
  <div class="orthophoniste-management">
    <div class="management-header">
      <h2>Gestion des orthophonistes</h2>
      <div class="header-actions">
        <div class="search-container">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Rechercher par nom ou prénom..."
            class="search-input"
          >
          <span class="search-icon">🔍</span>
        </div>
        <button @click="showCreateModal = true" class="btn-create">
          <span class="icon">➕</span>
          Créer un orthophoniste
        </button>
      </div>
    </div>

    <!-- Liste des orthophonistes -->
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="orthophonistes-grid">
      <div v-for="ortho in filteredOrthophonistes" :key="ortho.id" class="ortho-card">
        <div class="ortho-header">
          <div class="ortho-info">
            <h3>{{ ortho.firstName }} {{ ortho.lastName }}</h3>
            <p class="ortho-email">{{ ortho.email }}</p>
            <p class="ortho-patients">{{ ortho.patients?.length || 0 }} patient(s)</p>
          </div>
          <div class="ortho-actions">
            <button @click="editOrthophoniste(ortho)" class="btn-edit">
              <span class="icon">✏️</span>
            </button>
            <button @click="viewPatients(ortho)" class="btn-patients">
              <span class="icon">👥</span>
            </button>
            <button @click="deleteOrthophoniste(ortho)" class="btn-delete">
              <span class="icon">🗑️</span>
            </button>
          </div>
        </div>
        
        <div v-if="ortho.patients && ortho.patients.length > 0" class="patients-preview">
          <h4>Patients assignés :</h4>
          <div class="patients-list">
            <span v-for="patient in ortho.patients.slice(0, 3)" :key="patient.id" class="patient-tag">
              {{ patient.firstName }} {{ patient.lastName }}
            </span>
            <span v-if="ortho.patients.length > 3" class="more-patients">
              +{{ ortho.patients.length - 3 }} autres
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de création/édition -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showCreateModal ? 'Créer un orthophoniste' : 'Modifier l\'orthophoniste' }}</h3>
          <button @click="closeModals" class="btn-close">✕</button>
        </div>
        
        <form @submit.prevent="showCreateModal ? createOrthophoniste() : updateOrthophoniste()" class="modal-form">
          <div class="form-group">
            <label>Email *</label>
            <input v-model="formData.email" type="email" required />
          </div>
          
          <div class="form-group">
            <label>Prénom *</label>
            <input v-model="formData.firstName" type="text" required />
          </div>
          
          <div class="form-group">
            <label>Nom *</label>
            <input v-model="formData.lastName" type="text" required />
          </div>
          
                     <div class="form-group">
            <label>Mot de passe {{ showEditModal ? '(laisser vide pour ne pas changer)' : '*' }}</label>
            <input v-model="formData.password" type="password" :required="showCreateModal" />
          </div>
          
          <div class="form-group">
            <label>Téléphone</label>
            <input v-model="formData.phone" type="tel" />
          </div>
          
          <div class="form-group">
            <label>Adresse</label>
            <textarea v-model="formData.address" rows="2"></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Ville</label>
              <input v-model="formData.city" type="text" />
            </div>
            
            <div class="form-group">
              <label>Code postal</label>
              <input v-model="formData.postalCode" type="text" maxlength="10" />
            </div>
          </div>
          
          <div class="form-group">
            <label>URL photo de profil</label>
            <input v-model="formData.profilePictureUrl" type="url" />
          </div>
          
          <div class="form-group">
            <label>URL Doctolib</label>
            <input v-model="formData.doctolibUrl" type="url" />
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save" :disabled="formLoading">
              {{ formLoading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de visualisation des patients -->
    <div v-if="showPatientsModal" class="modal-overlay" @click="closePatientsModal">
      <div class="modal large-modal" @click.stop>
        <div class="modal-header">
          <h3>Patients de {{ selectedOrthophoniste?.firstName }} {{ selectedOrthophoniste?.lastName }}</h3>
          <button @click="closePatientsModal" class="btn-close">✕</button>
        </div>
        
        <div class="patients-content">
          <div v-if="patientsLoading" class="loading">Chargement des patients...</div>
          <div v-else-if="patients.length === 0" class="empty-state">
            Aucun patient assigné à cet orthophoniste
          </div>
          <div v-else class="patients-container">
            <!-- Version desktop (tableau) -->
            <div class="patients-table desktop-only">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Âge</th>
                    <th>Parent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="patient in patients" :key="patient.id">
                    <td>{{ patient.firstName }} {{ patient.lastName }}</td>
                    <td>{{ calculateAge(patient.birthDate) }} ans</td>
                    <td>{{ patient.parent?.firstName }} {{ patient.parent?.lastName }}</td>
                    <td>
                      <button @click="showReassignModal(patient)" class="btn-reassign">
                        Réassigner
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Version mobile (cartes) -->
            <div class="patients-cards mobile-only">
              <div v-for="patient in patients" :key="patient.id" class="patient-card">
                <div class="patient-header">
                  <h4>{{ patient.firstName }} {{ patient.lastName }}</h4>
                  <span class="patient-age">{{ calculateAge(patient.birthDate) }} ans</span>
                </div>
                <div class="patient-details">
                  <div class="patient-info">
                    <span class="info-label">Parent:</span>
                    <span class="info-value">{{ patient.parent?.firstName }} {{ patient.parent?.lastName }}</span>
                  </div>
                  <div class="patient-info">
                    <span class="info-label">Email:</span>
                    <span class="info-value">{{ patient.parent?.email }}</span>
                  </div>
                  <div class="patient-info">
                    <span class="info-label">Date d'ajout:</span>
                    <span class="info-value">{{ formatDate(patient.createdAt) }}</span>
                  </div>
                </div>
                <div class="patient-actions">
                  <button @click="showReassignModal(patient)" class="btn-reassign mobile-btn">
                    <span class="icon">↔️</span>
                    Réassigner
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de réassignation -->
    <div v-if="showReassignPatientModal" class="modal-overlay" @click="closeReassignModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Réassigner {{ selectedPatient?.firstName }} {{ selectedPatient?.lastName }}</h3>
          <button @click="closeReassignModal" class="btn-close">✕</button>
        </div>
        
        <form @submit.prevent="reassignPatient" class="modal-form">
          <div class="form-group">
            <label>Nouvel orthophoniste *</label>
            <select v-model="newOrthophonisteId" required>
              <option value="">Sélectionner un orthophoniste</option>
              <option 
                v-for="ortho in orthophonistes" 
                :key="ortho.id" 
                :value="ortho.id"
                :disabled="ortho.id === selectedPatient?.orthophonisteId"
              >
                {{ ortho.firstName }} {{ ortho.lastName }} ({{ ortho.patients?.length || 0 }} patients)
              </option>
            </select>
          </div>
          
          <div class="modal-actions">
            <button type="button" @click="closeReassignModal" class="btn-cancel">Annuler</button>
            <button type="submit" class="btn-save" :disabled="reassignLoading">
              {{ reassignLoading ? 'Réassignation...' : 'Réassigner' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

export default {
  name: 'OrthophonisteManagement',
  setup() {
    const orthophonistes = ref([])
    const patients = ref([])
    const loading = ref(false)
    const patientsLoading = ref(false)
    const formLoading = ref(false)
    const reassignLoading = ref(false)
    const error = ref('')
    const searchQuery = ref('')
    
    // Modals
    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const showPatientsModal = ref(false)
    const showReassignPatientModal = ref(false)
    
    // Form data
    const formData = ref({
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      profilePictureUrl: '',
      doctolibUrl: ''
    })
    
    const selectedOrthophoniste = ref(null)
        const selectedPatient = ref(null)
    const newOrthophonisteId = ref('')

    // Computed property pour filtrer les orthophonistes
    const filteredOrthophonistes = computed(() => {
      if (!searchQuery.value) {
        return orthophonistes.value
      }
      
      const query = searchQuery.value.toLowerCase().trim()
      return orthophonistes.value.filter(ortho => 
        ortho.firstName.toLowerCase().includes(query) ||
        ortho.lastName.toLowerCase().includes(query) ||
        ortho.email.toLowerCase().includes(query)
      )
    })

    // Charger les orthophonistes
    const loadOrthophonistes = async () => {
      try {
        console.log('Début de loadOrthophonistes');
        loading.value = true
        error.value = ''
        
        // Vérifier le token
        const token = localStorage.getItem('token');
        console.log('Token disponible:', !!token);
        console.log('Headers axios:', axios.defaults.headers.common);
        
        console.log('Envoi de la requête à:', axios.defaults.baseURL + '/ortho');
        const response = await axios.get('/ortho')
        console.log('Réponse reçue:', response.data);
        orthophonistes.value = response.data
      } catch (err) {
        console.error('Erreur lors du chargement des orthophonistes:', err);
        console.error('Détails de l\'erreur:', err.response?.data);
        console.error('Status de l\'erreur:', err.response?.status);
        error.value = err.response?.data?.message || 'Erreur lors du chargement'
      } finally {
        loading.value = false
      }
    }
    
    // Créer un orthophoniste
    const createOrthophoniste = async () => {
      try {
        formLoading.value = true
        await axios.post('/ortho', formData.value)
        await loadOrthophonistes()
        closeModals()
        // Notification de succès
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de la création'
      } finally {
        formLoading.value = false
      }
    }
    
    // Éditer un orthophoniste
    const editOrthophoniste = (ortho) => {
      selectedOrthophoniste.value = ortho
      formData.value = {
        email: ortho.email,
        firstName: ortho.firstName,
        lastName: ortho.lastName,
        password: '',
        phone: ortho.phone || '',
        address: ortho.address || '',
        city: ortho.city || '',
        postalCode: ortho.postalCode || '',
        profilePictureUrl: ortho.profilePictureUrl || '',
        doctolibUrl: ortho.doctolibUrl || ''
      }
      showEditModal.value = true
    }
    
    // Mettre à jour un orthophoniste
    const updateOrthophoniste = async () => {
      try {
        formLoading.value = true
        await axios.put(`/ortho/${selectedOrthophoniste.value.id}`, formData.value)
        await loadOrthophonistes()
        closeModals()
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de la modification'
      } finally {
        formLoading.value = false
      }
    }
    
    // Supprimer un orthophoniste
    const deleteOrthophoniste = async (ortho) => {
      const hasPatients = ortho.patients && ortho.patients.length > 0
      const confirmMessage = hasPatients 
        ? `Êtes-vous sûr de vouloir supprimer ${ortho.firstName} ${ortho.lastName} ?\n\nAttention : ${ortho.patients.length} patient(s) seront détachés de cet orthophoniste.`
        : `Êtes-vous sûr de vouloir supprimer ${ortho.firstName} ${ortho.lastName} ?`
      
      if (!confirm(confirmMessage)) {
        return
      }
      
      try {
        await axios.delete(`/ortho/${ortho.id}`)
        await loadOrthophonistes()
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de la suppression'
      }
    }
    
    // Voir les patients d'un orthophoniste
    const viewPatients = async (ortho) => {
      try {
        selectedOrthophoniste.value = ortho
        patientsLoading.value = true
        showPatientsModal.value = true
        
        const response = await axios.get(`/ortho/${ortho.id}/patients`)
        patients.value = response.data
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors du chargement des patients'
      } finally {
        patientsLoading.value = false
      }
    }
    
    // Afficher le modal de réassignation
    const showReassignModal = (patient) => {
      selectedPatient.value = patient
      newOrthophonisteId.value = ''
      showReassignPatientModal.value = true
    }
    
    // Réassigner un patient
    const reassignPatient = async () => {
      try {
        reassignLoading.value = true
        await axios.put(`/ortho/patients/${selectedPatient.value.id}/reassign`, {
          newOrthophonisteId: newOrthophonisteId.value
        })
        
        // Recharger les données
        await loadOrthophonistes()
        await viewPatients(selectedOrthophoniste.value)
        
        closeReassignModal()
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de la réassignation'
      } finally {
        reassignLoading.value = false
      }
    }
    
    // Fermer les modals
    const closeModals = () => {
      showCreateModal.value = false
      showEditModal.value = false
      selectedOrthophoniste.value = null
      formData.value = { 
        email: '', 
        firstName: '', 
        lastName: '', 
        password: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        profilePictureUrl: '',
        doctolibUrl: ''
      }
      error.value = ''
    }
    
    const closePatientsModal = () => {
      showPatientsModal.value = false
      patients.value = []
    }
    
    const closeReassignModal = () => {
      showReassignPatientModal.value = false
      selectedPatient.value = null
      newOrthophonisteId.value = ''
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
    
    // Formater une date pour l'affichage
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
    
    onMounted(() => {
      console.log('Composant OrthophonisteManagement monté, chargement des orthophonistes...');
      loadOrthophonistes()
    })
    
    return {
      orthophonistes,
      patients,
      loading,
      patientsLoading,
      formLoading,
      reassignLoading,
      error,
      searchQuery,
      filteredOrthophonistes,
      showCreateModal,
      showEditModal,
      showPatientsModal,
      showReassignPatientModal,
      formData,
      selectedOrthophoniste,
      selectedPatient,
      newOrthophonisteId,
      loadOrthophonistes,
      createOrthophoniste,
      editOrthophoniste,
      updateOrthophoniste,
      deleteOrthophoniste,
      viewPatients,
      showReassignModal,
      reassignPatient,
      closeModals,
      closePatientsModal,
      closeReassignModal,
      calculateAge,
      formatDate
    }
  }
}
</script>

<style scoped>
.orthophoniste-management {
  padding: 1rem;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .management-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin-bottom: 1rem;
  }
}

.management-header h2 {
  margin: 0;
  color: #2C3E50;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 250px;
  transition: all 0.3s ease;
}

@media (max-width: 768px) {
  .search-input {
    width: 200px;
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
}

.search-input:focus {
  outline: none;
  border-color: #4B95DE;
  box-shadow: 0 0 0 3px rgba(75, 149, 222, 0.1);
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  color: #666;
  pointer-events: none;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.orthophonistes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .orthophonistes-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.ortho-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.ortho-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.ortho-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.ortho-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2C3E50;
}

.ortho-email {
  color: #666;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.ortho-patients {
  color: #4B95DE;
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0;
}

.ortho-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-patients, .btn-delete {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-edit {
  background: #FFE0B2;
  color: #F57C00;
}

.btn-patients {
  background: #E3F2FD;
  color: #1976D2;
}

.btn-delete {
  background: #FFEBEE;
  color: #D32F2F;
}

.btn-edit:hover, .btn-patients:hover, .btn-delete:hover {
  transform: translateY(-1px);
}

.patients-preview {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #E0E0E0;
}

.patients-preview h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
}

.patients-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.patient-tag {
  background: #F5F5F5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}

.more-patients {
  background: #E3F2FD;
  color: #1976D2;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
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

.large-modal {
  max-width: 800px;
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

.form-group input, .form-group select, .form-group textarea {
  padding: 0.75rem;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  outline: none;
  border-color: #4B95DE;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group textarea {
  resize: vertical;
  min-height: 60px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel, .btn-save {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #F5F5F5;
  color: #666;
}

.btn-save {
  background: #4B95DE;
  color: white;
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.patients-container {
  width: 100%;
}

.patients-table {
  overflow-x: auto;
}

.patients-table table {
  width: 100%;
  border-collapse: collapse;
}

.patients-table th,
.patients-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #E0E0E0;
}

.patients-table th {
  background: #F5F5F5;
  font-weight: 600;
  color: #2C3E50;
}

/* Styles pour les cartes patients sur mobile */
.patients-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.patient-card {
  background: #F8F9FA;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.patient-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.patient-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #E0E0E0;
}

.patient-header h4 {
  margin: 0;
  color: #2C3E50;
  font-size: 1.1rem;
}

.patient-age {
  background: #E3F2FD;
  color: #1976D2;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
}

.patient-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.patient-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.info-value {
  color: #2C3E50;
  font-size: 0.9rem;
  text-align: right;
  max-width: 60%;
  word-break: break-word;
}

.patient-actions {
  display: flex;
  justify-content: center;
}

.mobile-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  justify-content: center;
  padding: 0.75rem;
  font-size: 1rem;
}

/* Classes de visibilité responsive */
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

.btn-reassign {
  padding: 0.5rem 1rem;
  background: #FFF3E0;
  color: #F57C00;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-reassign:hover {
  background: #FFE0B2;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #D32F2F;
  background: #FFEBEE;
  border-radius: 6px;
}

.icon {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .management-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .orthophonistes-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    width: 95%;
    padding: 1rem;
  }
  
  .ortho-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .ortho-actions {
    justify-content: center;
  }
  
  /* Basculer entre versions desktop et mobile */
  .desktop-only {
    display: none;
  }
  
  .mobile-only {
    display: block;
  }
  
  /* Ajustements pour les modals sur mobile */
  .large-modal {
    max-width: 95%;
    width: 95%;
  }
  
  .patients-content {
    max-height: 70vh;
    overflow-y: auto;
  }
}
</style> 