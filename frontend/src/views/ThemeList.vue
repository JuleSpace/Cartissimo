<template>
  <div class="theme-list">
    <div class="header">
      <h1>Séries</h1>
      <div class="actions">
        <button v-if="userRole === 'orthophonist'" @click="createNewTheme" class="create-button">
          Créer une nouvelle série
        </button>
        <button v-if="userRole === 'admin'" @click="goToAdmin" class="admin-button">
          Panneau d'administration
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      Chargement...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="themes-grid">
      <div v-for="theme in filteredThemes" :key="theme.id" class="theme-card">
        <img v-if="theme.image" :src="`http://192.168.1.32:3000${theme.image}`" :alt="theme.name" class="theme-image"/>
        <h2>{{ theme.name }}</h2>
        <p>{{ theme.description }}</p>
        <div class="theme-footer">
          <span class="category">{{ theme.category }}</span>
          <span v-if="theme.status === 'pending'" class="pending">En attente d'approbation</span>
          <span v-if="theme.status === 'rejected'" class="rejected">Rejeté</span>
        </div>
        <button @click="viewAnimations(theme.id)" class="view-button">
          Voir les animations
        </button>
        <button v-if="userRole === 'orthophonist'" @click="manageAccess(theme.id)" class="access-button">
          Gérer les accès
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'ThemeList',
  setup() {
    const store = useStore();
    const router = useRouter();

    const themes = computed(() => store.state.themes.themes);
    const loading = computed(() => store.state.themes.loading);
    const error = computed(() => store.state.themes.error);
    const userRole = computed(() => store.getters['auth/userRole']);

    const filteredThemes = computed(() => {
      if (!themes.value) return [];
      if (userRole.value === 'admin') {
        return themes.value;
      }
      if (userRole.value === 'orthophonist') {
        return themes.value.filter(theme => theme.status !== 'rejected');
      }
      // Pour les parents, ne montrer que les thèmes approuvés
      return themes.value.filter(theme => theme.status === 'approved');
    });

    const createNewTheme = () => {
      router.push('/themes/create');
    };

    const goToAdmin = () => {
      router.push('/admin');
    };

    const viewAnimations = (themeId) => {
      router.push(`/themes/${themeId}/animations`);
    };

    const manageAccess = (themeId) => {
      router.push(`/themes/${themeId}/access`);
    };

    onMounted(async () => {
      try {
        await store.dispatch('themes/fetchThemes');
      } catch (err) {
        console.error('Erreur lors du chargement des thèmes:', err);
      }
    });

    return {
      filteredThemes,
      loading,
      error,
      userRole,
      createNewTheme,
      goToAdmin,
      viewAnimations,
      manageAccess
    };
  }
};
</script>

<style scoped>
.theme-list {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.create-button, .admin-button, .view-button, .access-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.create-button {
  background: #FFD75C;
  color: #2C3E50;
  box-shadow: 0 2px 4px rgba(255, 215, 92, 0.2);
}

.create-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 92, 0.4);
}

.admin-button {
  background: #FFD75C;
  color: #2C3E50;
  box-shadow: 0 2px 4px rgba(255, 215, 92, 0.2);
}

.admin-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 92, 0.4);
}

.view-button {
  background: linear-gradient(135deg, #7FD1F4 0%, #4B95DE 100%);
  color: white;
  width: 100%;
  margin-top: 1rem;
  box-shadow: 0 2px 4px rgba(75, 149, 222, 0.2);
}

.view-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(75, 149, 222, 0.4);
}

.access-button {
  background: linear-gradient(135deg, #FFD75C 0%, #FFA000 100%);
  color: #2C3E50;
  width: 100%;
  margin-top: 0.5rem;
  box-shadow: 0 2px 4px rgba(255, 215, 92, 0.2);
}

.access-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 92, 0.4);
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.theme-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.theme-card:hover {
  transform: translateY(-2px);
}

.theme-card h2 {
  margin: 0 0 1rem 0;
  color: #2C3E50;
}

.theme-card p {
  color: #666;
  margin: 0 0 1rem 0;
}

.theme-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}
.theme-image {
  width: 150px;
  height: 150px;
}
.theme-image:hover {
  transform: scale(1.05);
  transition: transform 0.3s ease;
}

.category {
  background: #E3F2FD;
  color: #1976D2;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.pending {
  color: #FFA000;
  font-size: 0.875rem;
}

.rejected {
  color: #D32F2F;
  font-size: 0.875rem;
  font-weight: 500;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #D32F2F;
}
</style> 