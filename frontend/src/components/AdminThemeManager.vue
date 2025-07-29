<template>
  <div class="admin-theme-manager">
    <div class="header">
      <h2>Gestion complète des thèmes</h2>
      <p class="header-description">Visualiser, modifier et supprimer tous les thèmes du système</p>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="themes-content">
      <!-- Filtres -->
      <div class="filters">
        <div class="filter-group">
          <label>Filtrer par statut :</label>
          <select v-model="selectedStatus" @change="filterThemes">
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvé</option>
            <option value="rejected">Rejeté</option>
          </select>
        </div>
        
        <div class="search-group">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Rechercher par nom..."
            @input="filterThemes"
            class="search-input"
          >
        </div>
      </div>

      <!-- Statistiques -->
      <div class="stats">
        <div class="stat-card">
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">Total</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.approved }}</div>
          <div class="stat-label">Approuvés</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.pending }}</div>
          <div class="stat-label">En attente</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.rejected }}</div>
          <div class="stat-label">Rejetés</div>
        </div>
      </div>

      <!-- Liste des thèmes -->
      <div v-if="filteredThemes.length === 0" class="empty-state">
        Aucun thème trouvé pour les critères sélectionnés
      </div>
      <div v-else class="themes-grid">
        <div v-for="theme in filteredThemes" :key="theme.id" class="theme-card">
          <div class="theme-header">
            <h3>{{ theme.name }}</h3>
            <span :class="['status-badge', `status-${theme.status}`]">
              {{ getStatusText(theme.status) }}
            </span>
          </div>
          
          <div class="theme-body">
            <p class="theme-description">{{ theme.description || 'Aucune description' }}</p>
            <div class="theme-meta">
              <div class="meta-item">
                <strong>Créé par:</strong> {{ theme.creator?.email || 'Système' }}
              </div>
              <div class="meta-item">
                <strong>Créé le:</strong> {{ formatDate(theme.createdAt) }}
              </div>
              <div class="meta-item">
                <strong>Ordre:</strong> {{ theme.order || 0 }}
              </div>
            </div>
          </div>

          <div class="theme-actions">
            <button 
              v-if="theme.status === 'pending'" 
              @click="approveTheme(theme.id)" 
              class="btn-approve"
              :disabled="actionLoading[theme.id]"
            >
              {{ actionLoading[theme.id] ? 'Traitement...' : 'Approuver' }}
            </button>
            
            <button 
              v-if="theme.status === 'approved'" 
              @click="rejectTheme(theme.id)" 
              class="btn-reject"
              :disabled="actionLoading[theme.id]"
            >
              {{ actionLoading[theme.id] ? 'Traitement...' : 'Rejeter' }}
            </button>
            
            <button 
              v-if="theme.status === 'rejected'" 
              @click="approveTheme(theme.id)" 
              class="btn-approve"
              :disabled="actionLoading[theme.id]"
            >
              {{ actionLoading[theme.id] ? 'Traitement...' : 'Réapprouver' }}
            </button>

            <button 
              @click="deleteTheme(theme)" 
              class="btn-delete"
              :disabled="actionLoading[theme.id]"
            >
              {{ actionLoading[theme.id] ? 'Suppression...' : '🗑️ Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'AdminThemeManager',
  setup() {
    const store = useStore()
    const loading = ref(false)
    const error = ref('')
    const selectedStatus = ref('')
    const searchQuery = ref('')
    const actionLoading = ref({})

    const themes = computed(() => store.state.themes.themes || [])
    
    const filteredThemes = ref([])

    // Statistiques
    const stats = computed(() => {
      const allThemes = themes.value
      return {
        total: allThemes.length,
        approved: allThemes.filter(t => t.status === 'approved').length,
        pending: allThemes.filter(t => t.status === 'pending').length,
        rejected: allThemes.filter(t => t.status === 'rejected').length
      }
    })

    const filterThemes = () => {
      let filtered = themes.value

      // Filtrer par statut
      if (selectedStatus.value) {
        filtered = filtered.filter(theme => theme.status === selectedStatus.value)
      }

      // Filtrer par recherche
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(theme => 
          theme.name.toLowerCase().includes(query) ||
          (theme.description && theme.description.toLowerCase().includes(query))
        )
      }

      filteredThemes.value = filtered
    }

    const loadThemes = async () => {
      try {
        loading.value = true
        error.value = ''
        await store.dispatch('themes/fetchThemes')
        filterThemes()
      } catch (err) {
        error.value = err.message || 'Erreur lors du chargement des thèmes'
      } finally {
        loading.value = false
      }
    }

    const approveTheme = async (themeId) => {
      try {
        actionLoading.value[themeId] = true
        await store.dispatch('themes/approveTheme', themeId)
        filterThemes()
      } catch (err) {
        error.value = err.message || 'Erreur lors de l\'approbation'
      } finally {
        actionLoading.value[themeId] = false
      }
    }

    const rejectTheme = async (themeId) => {
      try {
        actionLoading.value[themeId] = true
        await store.dispatch('themes/rejectTheme', themeId)
        filterThemes()
      } catch (err) {
        error.value = err.message || 'Erreur lors du rejet'
      } finally {
        actionLoading.value[themeId] = false
      }
    }

    const deleteTheme = async (theme) => {
      const confirmMessage = `Êtes-vous sûr de vouloir supprimer le thème "${theme.name}" ?\n\nCette action est irréversible et supprimera également toutes les animations associées.`
      
      if (!confirm(confirmMessage)) {
        return
      }

      try {
        actionLoading.value[theme.id] = true
        await store.dispatch('themes/deleteTheme', theme.id)
        filterThemes()
      } catch (err) {
        error.value = err.message || 'Erreur lors de la suppression'
      } finally {
        actionLoading.value[theme.id] = false
      }
    }

    const getStatusText = (status) => {
      const statusMap = {
        'pending': 'En attente',
        'approved': 'Approuvé',
        'rejected': 'Rejeté'
      }
      return statusMap[status] || status
    }

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      loadThemes()
    })

    return {
      loading,
      error,
      selectedStatus,
      searchQuery,
      filteredThemes,
      stats,
      actionLoading,
      filterThemes,
      approveTheme,
      rejectTheme,
      deleteTheme,
      getStatusText,
      formatDate
    }
  }
}
</script>

<style scoped>
.admin-theme-manager {
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

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #2C3E50;
  white-space: nowrap;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-group {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  font-size: 0.9rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4B95DE;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.theme-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.theme-card:hover {
  transform: translateY(-2px);
}

.theme-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.theme-header h3 {
  margin: 0;
  color: #2C3E50;
  font-size: 1.1rem;
  flex: 1;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending { background: #FFF3E0; color: #EF6C00; }
.status-approved { background: #E8F5E8; color: #2E7D32; }
.status-rejected { background: #FFEBEE; color: #C62828; }

.theme-body {
  margin-bottom: 1.5rem;
}

.theme-description {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
}

.theme-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-item {
  font-size: 0.8rem;
  color: #666;
}

.meta-item strong {
  color: #2C3E50;
}

.theme-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.theme-actions button {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}

.btn-approve {
  background: #4CAF50;
  color: white;
}

.btn-approve:hover:not(:disabled) {
  background: #45a049;
}

.btn-reject {
  background: #f44336;
  color: white;
}

.btn-reject:hover:not(:disabled) {
  background: #da190b;
}

.btn-delete {
  background: #ff6b6b;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background: #ff5252;
}

.theme-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #f44336;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .search-group {
    min-width: unset;
  }

  .themes-grid {
    grid-template-columns: 1fr;
  }

  .theme-actions {
    flex-direction: column;
  }

  .theme-actions button {
    flex: none;
  }
}
</style> 