<template>
  <div class="parent-management">
    <div class="management-header">
      <h2>Gestion des parents</h2>
      <div class="header-actions">
        <div class="search-container">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Rechercher par nom ou email..."
            class="search-input"
          >
          <span class="search-icon">🔍</span>
        </div>
      </div>
    </div>

    <!-- Liste des parents -->
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="parents-grid">
      <div v-for="parent in filteredParents" :key="parent.id" class="parent-card">
        <div class="parent-header">
          <div class="parent-info">
            <h3>{{ parent.firstName }} {{ parent.lastName }}</h3>
            <p class="parent-email">{{ parent.email }}</p>
            <p class="parent-children">{{ parent.patients?.length || 0 }} enfant(s)</p>
          </div>
          <div class="parent-actions">
            <button @click="viewChildren(parent)" class="btn-children">
              <span class="icon">👶</span>
            </button>
            <button @click="deleteParent(parent)" class="btn-delete">
              <span class="icon">🗑️</span>
            </button>
          </div>
        </div>
        
        <div v-if="parent.patients && parent.patients.length > 0" class="children-preview">
          <h4>Enfants :</h4>
          <div class="children-list">
            <span v-for="child in parent.patients.slice(0, 3)" :key="child.id" class="child-tag">
              {{ child.firstName }} {{ child.lastName }}
            </span>
            <span v-if="parent.patients.length > 3" class="more-children">
              +{{ parent.patients.length - 3 }} autres
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de visualisation des enfants -->
    <div v-if="showChildrenModal" class="modal-overlay" @click="closeChildrenModal">
      <div class="modal large-modal" @click.stop>
        <div class="modal-header">
          <h3>Enfants de {{ selectedParent?.firstName }} {{ selectedParent?.lastName }}</h3>
          <button @click="closeChildrenModal" class="btn-close">✕</button>
        </div>
        
        <div class="children-content">
          <div v-if="childrenLoading" class="loading">Chargement des enfants...</div>
          <div v-else-if="children.length === 0" class="empty-state">
            Aucun enfant pour ce parent
          </div>
          <div v-else class="children-container">
            <!-- Version desktop (tableau) -->
            <div class="children-table desktop-only">
              <table>
                                 <thead>
                   <tr>
                     <th>Nom</th>
                     <th>Âge</th>
                     <th>Orthophoniste</th>
                   </tr>
                 </thead>
                                 <tbody>
                   <tr v-for="child in children" :key="child.id">
                     <td>{{ child.firstName }} {{ child.lastName }}</td>
                     <td>{{ calculateAge(child.birthDate) }} ans</td>
                     <td>{{ child.orthophoniste?.firstName }} {{ child.orthophoniste?.lastName || 'Non assigné' }}</td>
                   </tr>
                 </tbody>
              </table>
            </div>

            <!-- Version mobile (cartes) -->
            <div class="children-cards mobile-only">
              <div v-for="child in children" :key="child.id" class="child-card">
                <div class="child-header">
                  <h4>{{ child.firstName }} {{ child.lastName }}</h4>
                  <span class="child-age">{{ calculateAge(child.birthDate) }} ans</span>
                </div>
                                 <div class="child-details">
                   <div class="child-info">
                     <span class="info-label">Orthophoniste:</span>
                     <span class="info-value">{{ child.orthophoniste?.firstName }} {{ child.orthophoniste?.lastName || 'Non assigné' }}</span>
                   </div>
                   <div class="child-info">
                     <span class="info-label">Date d'ajout:</span>
                     <span class="info-value">{{ formatDate(child.createdAt) }}</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

export default {
  name: 'ParentManagement',
  setup() {
    const parents = ref([])
    const children = ref([])
    const loading = ref(false)
    const childrenLoading = ref(false)
    const error = ref('')
    const searchQuery = ref('')
    
    // Modals
    const showChildrenModal = ref(false)
    
    const selectedParent = ref(null)

    // Computed property pour filtrer les parents
    const filteredParents = computed(() => {
      if (!searchQuery.value) {
        return parents.value
      }
      
      const query = searchQuery.value.toLowerCase().trim()
      return parents.value.filter(parent => 
        parent.firstName.toLowerCase().includes(query) ||
        parent.lastName.toLowerCase().includes(query) ||
        parent.email.toLowerCase().includes(query)
      )
    })

    // Charger les parents
    const loadParents = async () => {
      try {
        console.log('Début de loadParents');
        loading.value = true
        error.value = ''
        
        const token = localStorage.getItem('token');
        console.log('Token disponible:', !!token);
        
        const response = await axios.get('/users/parents', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log('Parents reçus:', response.data);
        parents.value = response.data
      } catch (err) {
        console.error('Erreur lors du chargement des parents:', err);
        console.error('Détails de l\'erreur:', err.response?.data);
        error.value = err.response?.data?.message || 'Erreur lors du chargement'
      } finally {
        loading.value = false
      }
    }
    
    // Voir les enfants d'un parent
    const viewChildren = async (parent) => {
      try {
        selectedParent.value = parent
        childrenLoading.value = true
        showChildrenModal.value = true
        
        const token = localStorage.getItem('token');
        const response = await axios.get(`/users/${parent.id}/children`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        children.value = response.data
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors du chargement des enfants'
      } finally {
        childrenLoading.value = false
      }
    }
    
    // Supprimer un parent
    const deleteParent = async (parent) => {
      const hasChildren = parent.patients && parent.patients.length > 0
      const confirmMessage = hasChildren 
        ? `Êtes-vous sûr de vouloir supprimer ${parent.firstName} ${parent.lastName} ?\n\nAttention : ${parent.patients.length} enfant(s) seront également supprimés.`
        : `Êtes-vous sûr de vouloir supprimer ${parent.firstName} ${parent.lastName} ?`
      
      if (!confirm(confirmMessage)) {
        return
      }
      
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`/users/${parent.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        await loadParents()
      } catch (err) {
        error.value = err.response?.data?.message || 'Erreur lors de la suppression'
      }
    }
    

    
    // Fermer le modal des enfants
    const closeChildrenModal = () => {
      showChildrenModal.value = false
      children.value = []
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
      console.log('Composant ParentManagement monté, chargement des parents...');
      loadParents()
    })
    
    return {
      parents,
      children,
      loading,
      childrenLoading,
      error,
      searchQuery,
      filteredParents,
      showChildrenModal,
      selectedParent,
      loadParents,
      viewChildren,
      deleteParent,
      closeChildrenModal,
      calculateAge,
      formatDate
    }
  }
}
</script>

<style scoped>
.parent-management {
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

.parents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .parents-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.parent-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.parent-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.parent-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.parent-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2C3E50;
}

.parent-email {
  color: #666;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}

.parent-children {
  color: #4B95DE;
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0;
}

.parent-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-children, .btn-delete {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-children {
  background: #E3F2FD;
  color: #1976D2;
}

.btn-delete {
  background: #FFEBEE;
  color: #D32F2F;
}

.btn-children:hover, .btn-delete:hover {
  transform: translateY(-1px);
}

.children-preview {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #E0E0E0;
}

.children-preview h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: #666;
}

.children-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.child-tag {
  background: #F5F5F5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}

.more-children {
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

.children-container {
  width: 100%;
}

.children-table {
  overflow-x: auto;
}

.children-table table {
  width: 100%;
  border-collapse: collapse;
}

.children-table th,
.children-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #E0E0E0;
}

.children-table th {
  background: #F5F5F5;
  font-weight: 600;
  color: #2C3E50;
}

/* Styles pour les cartes enfants sur mobile */
.children-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.child-card {
  background: #F8F9FA;
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s ease;
}

.child-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.child-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #E0E0E0;
}

.child-header h4 {
  margin: 0;
  color: #2C3E50;
  font-size: 1.1rem;
}

.child-age {
  background: #E3F2FD;
  color: #1976D2;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
}

.child-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.child-info {
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

.child-actions {
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

.btn-delete-child {
  padding: 0.5rem 1rem;
  background: #FFEBEE;
  color: #D32F2F;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-delete-child:hover {
  background: #FFCDD2;
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
  
  .parents-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    width: 95%;
    padding: 1rem;
  }
  
  .parent-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .parent-actions {
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
  
  .children-content {
    max-height: 70vh;
    overflow-y: auto;
  }
}
</style> 