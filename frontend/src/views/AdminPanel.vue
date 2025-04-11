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
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-back {
  padding: 0.5rem 1rem;
  background-color: #4B95DE;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.admin-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.admin-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.themes-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.theme-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.theme-card h3 {
  margin: 0 0 1rem 0;
  color: #2C3E50;
}

.theme-card p {
  color: #666;
  margin: 0 0 1rem 0;
}

.card-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-approve, .btn-reject {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-approve {
  background-color: #4CAF50;
  color: white;
}

.btn-reject {
  background-color: #f44336;
  color: white;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #f44336;
}
</style> 