<template>
  <div class="theme-container">
    <h1>Thèmes disponibles</h1>
    
    <div v-if="loading" class="loading">
      Chargement des thèmes...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else class="theme-grid">
      <div v-for="theme in themes" :key="theme.id" class="theme-card">
        <h3>{{ theme.name }}</h3>
        <p>{{ theme.description }}</p>
        <router-link :to="'/theme/' + theme.id" class="view-button">
          Voir le thème
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
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

    const goToTheme = (themeId) => {
      router.push(`/themes/${themeId}/animations`);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    store.dispatch('themes/fetchThemes');

    return {
      themes,
      loading,
      error,
      goToTheme,
      formatDate
    };
  }
};
</script>

<style scoped>
.theme-container {
  min-height: 100vh;
  padding: 20px;
}

.theme-container h1 {
  text-align: center;
  color: var(--primary-color);
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 40px;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px;
}

.theme-card {
  background: #FFFFFF;
  border-radius: 25px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.theme-card h3 {
  color: #2C3E50;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

.theme-card p {
  color: #2C3E50;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
}

.view-button {
  display: inline-block;
  padding: 10px 25px;
  background: linear-gradient(to right, var(--blue-light), var(--blue));
  color: white;
  text-decoration: none;
  border-radius: 20px;
  font-weight: 500;
  margin-top: auto;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  background: #FFFFFF;
  border-radius: 25px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  max-width: 400px;
}

.error {
  color: var(--coral);
}

@media (max-width: 768px) {
  .theme-grid {
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .theme-container {
    padding: var(--spacing-md);
  }

  .theme-grid {
    grid-template-columns: 1fr;
  }
}
</style> 