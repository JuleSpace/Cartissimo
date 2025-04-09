<template>
  <div class="animation-container">
    <div class="animation-header">
      <h1 class="animation-title">{{ currentTheme?.name }}</h1>
      <p class="animation-description">{{ currentTheme?.description }}</p>
      <button @click="goBack" class="back-button">
        <span class="icon">←</span>
        Retour aux thèmes
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <span>Chargement des animations...</span>
    </div>

    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div v-else class="animation-content">
      <div class="main-animation">
        <div class="animation-display">
          <img :src="currentAnimation?.imagePath" 
               :alt="currentAnimation?.name" 
               class="animation-image" />
        </div>
        <div class="controls">
          <button @click="playSound" class="control-button play-sound-button">
            <span class="icon">▶</span>
            Jouer le son
          </button>
          <button @click="previousAnimation" 
                  :disabled="!hasPrevious" 
                  class="control-button nav-button">
            <span class="icon">←</span>
            Précédent
          </button>
          <button @click="nextAnimation" 
                  :disabled="!hasNext" 
                  class="control-button nav-button">
            <span class="icon">→</span>
            Suivant
          </button>
        </div>
      </div>

      <div class="animation-list">
        <h2 class="animation-list-title">Animations disponibles</h2>
        <div class="animation-items">
          <div v-for="animation in animations" 
               :key="animation.id"
               @click="selectAnimation(animation)"
               :class="['animation-item', { active: animation.id === currentAnimation?.id }]">
            <img :src="animation.imagePath" 
                 :alt="animation.name" 
                 class="animation-item-image" />
            <span class="animation-item-name">{{ animation.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'AnimationViewer',
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    
    const currentTheme = ref(null);
    const currentAnimation = ref(null);
    const audioPlayer = ref(null);
    const currentSound = ref(null);
    
    const animations = computed(() => store.state.animations.items);
    const loading = computed(() => store.state.animations.loading);
    const error = computed(() => store.state.animations.error);
    
    const hasPrevious = computed(() => {
      if (!currentAnimation.value || !animations.value) return false;
      const currentIndex = animations.value.findIndex(a => a.id === currentAnimation.value.id);
      return currentIndex > 0;
    });
    
    const hasNext = computed(() => {
      if (!currentAnimation.value || !animations.value) return false;
      const currentIndex = animations.value.findIndex(a => a.id === currentAnimation.value.id);
      return currentIndex < animations.value.length - 1;
    });

    const fetchData = async () => {
      const themeId = route.params.themeId;
      try {
        await store.dispatch('themes/fetchTheme', themeId);
        await store.dispatch('animations/fetchAnimations', themeId);
        currentTheme.value = store.state.themes.currentTheme;
        if (animations.value.length > 0) {
          currentAnimation.value = animations.value[0];
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
      }
    };

    const playSound = () => {
      if (currentAnimation.value?.soundPath) {
        currentSound.value = currentAnimation.value.soundPath;
        if (audioPlayer.value) {
          audioPlayer.value.play();
        }
      }
    };

    const previousAnimation = () => {
      if (!hasPrevious.value) return;
      const currentIndex = animations.value.findIndex(a => a.id === currentAnimation.value.id);
      currentAnimation.value = animations.value[currentIndex - 1];
    };

    const nextAnimation = () => {
      if (!hasNext.value) return;
      const currentIndex = animations.value.findIndex(a => a.id === currentAnimation.value.id);
      currentAnimation.value = animations.value[currentIndex + 1];
    };

    const selectAnimation = (animation) => {
      currentAnimation.value = animation;
    };

    const goBack = () => {
      router.push('/themes');
    };

    // Charger les données au montage
    fetchData();

    return {
      currentTheme,
      currentAnimation,
      animations,
      loading,
      error,
      hasPrevious,
      hasNext,
      audioPlayer,
      currentSound,
      playSound,
      previousAnimation,
      nextAnimation,
      selectAnimation,
      goBack
    };
  }
};
</script>

<style scoped>
.animation-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.animation-header {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: var(--shadow-sm);
  position: relative;
}

.animation-title {
  color: var(--blue);
  font-size: 2rem;
  margin-bottom: 10px;
}

.animation-description {
  color: var(--text-primary);
  font-size: 1.1rem;
  line-height: 1.6;
}

.back-button {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--blue) 100%);
  color: var(--text-light);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.animation-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.main-animation {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.animation-display {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  border: 3px solid var(--mint);
}

.animation-image {
  width: 100%;
  max-height: 500px;
  object-fit: contain;
  display: block;
}

.controls {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.control-button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
}

.play-sound-button {
  background: #FFD75C;
  color: #2C3E50;
  box-shadow: 0 2px 4px rgba(255, 215, 92, 0.2);
}

.play-sound-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 92, 0.4);
}

.nav-button {
  background: linear-gradient(135deg, #7FD1F4 0%, #4B95DE 100%);
  color: white;
  box-shadow: 0 2px 4px rgba(75, 149, 222, 0.2);
}

.nav-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(75, 149, 222, 0.4);
}

.control-button:disabled {
  background: #E0E0E0;
  color: #9E9E9E;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.7;
}

.animation-list {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.animation-list-title {
  color: var(--blue);
  font-size: 1.5rem;
  margin-bottom: 20px;
  font-weight: 600;
}

.animation-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 600px;
  overflow-y: auto;
}

.animation-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition-fast);
  border: 2px solid transparent;
}

.animation-item:hover {
  background: var(--bg-primary);
  transform: translateX(4px);
}

.animation-item.active {
  border-color: var(--mint);
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--blue) 100%);
}

.animation-item.active .animation-item-name {
  color: var(--text-light);
}

.animation-item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.animation-item-name {
  color: var(--text-primary);
  font-weight: 500;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  color: var(--blue);
  font-size: 1.2rem;
}

.error-state {
  text-align: center;
  color: var(--coral);
  background: var(--bg-secondary);
  padding: 20px;
  border-radius: 8px;
  margin: 30px auto;
  max-width: 600px;
  box-shadow: var(--shadow-sm);
}

.icon {
  font-size: 1.2rem;
}
</style> 