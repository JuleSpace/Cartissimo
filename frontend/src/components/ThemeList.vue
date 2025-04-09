<template>
  <div class="theme-list">
    <h2>Thèmes disponibles</h2>
    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="themes-grid">
      <div
        v-for="theme in themes"
        :key="theme.id"
        class="theme-card"
        @click="selectTheme(theme)"
      >
        <h3>{{ theme.name }}</h3>
        <p>{{ theme.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'ThemeList',
  setup() {
    const store = useStore();
    const router = useRouter();

    const fetchThemes = async () => {
      try {
        await store.dispatch('theme/fetchThemes');
      } catch (error) {
        console.error('Erreur lors du chargement des thèmes:', error);
      }
    };

    const selectTheme = (theme) => {
      router.push(`/themes/${theme.id}/animations`);
    };

    onMounted(fetchThemes);

    return {
      selectTheme
    };
  },
  computed: {
    themes() {
      return this.$store.getters['theme/allThemes'];
    },
    loading() {
      return this.$store.getters['theme/isLoading'];
    },
    error() {
      return this.$store.getters['theme/error'];
    }
  }
};
</script>

<style scoped>
.theme-list {
  padding: 20px;
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.theme-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.theme-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  padding: 20px;
}

.error {
  color: red;
  text-align: center;
  padding: 20px;
}
</style> 