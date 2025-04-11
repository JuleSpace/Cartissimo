<template>
  <div class="admin-panel">
    <div class="header">
      <h1>Panneau d'administration</h1>
      <button @click="$router.push('/themes')" class="btn-back">
        Retour aux thèmes
      </button>
    </div>

    <div class="admin-sections">
      <!-- Section des thèmes -->
      <section class="admin-section">
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
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'AdminPanel',
  setup() {
    const store = useStore();
    const loading = ref(false);
    const error = ref('');

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

    return {
      loading,
      error,
      pendingThemes,
      approveTheme,
      rejectTheme
    };
  }
};
</script>

<style scoped>
.admin-panel {
  padding: 0.5rem;
  max-width: 1200px;
  margin: 70px auto 0;
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
    margin: 40px auto 0;
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