<template>
  <div class="animation-viewer container">
    <div class="header">
      <h1>{{ themeName }}</h1>
    </div>

    <div class="back-button-container">
      <button @click="goBack" class="btn btn-primary back-button">
        <span class="back-icon">←</span>
        Retour aux thèmes
      </button>
    </div>

    <div v-if="loading" class="loading">Chargement...</div>
    <div v-else-if="error" class="alert alert-error">{{ error }}</div>
    <div v-else class="animations-container">
      <div class="grid grid-2">
        <div class="card">
          <h3>Version Animée</h3>
          <img 
            :src="getImagePath(currentAnimations[0]?.animatedGifPath)" 
            :alt="currentAnimations[0]?.name + ' animé'"
            class="animation-image"
          >
          <p>{{ currentAnimations[0]?.description }}</p>
        </div>
        <div class="card">
          <h3>Version Réelle</h3>
          <img 
            :src="getImagePath(currentAnimations[0]?.realGifPath)" 
            :alt="currentAnimations[0]?.name + ' réel'"
            class="animation-image"
          >
          <p>{{ currentAnimations[0]?.description }}</p>
        </div>
      </div>

      <div class="controls">
        <button 
          @click="previousAnimation" 
          :disabled="currentIndex === 0"
          class="btn btn-primary"
        >
          Précédent
        </button>
        <button 
          @click="playSound" 
          class="btn btn-secondary"
          :disabled="!currentSound"
        >
          {{ isPlaying ? 'Arrêter' : 'Jouer le son' }}
        </button>
        <button 
          @click="nextAnimation" 
          :disabled="currentIndex >= animations.length - 1"
          class="btn btn-primary"
        >
          Suivant
        </button>
      </div>
    </div>

    <audio 
      ref="audioPlayer" 
      :src="currentSound" 
      @ended="handleAudioEnded"
      preload="auto"
    ></audio>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'AnimationViewer',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const animations = ref([]);
    const currentIndex = ref(0);
    const loading = ref(true);
    const error = ref('');
    const themeName = ref('');
    const audioPlayer = ref(null);
    const isPlaying = ref(false);

    const currentAnimations = computed(() => {
      console.log('Toutes les animations:', animations.value);
      if (!animations.value.length) return [];
      
      // Trouver le type actuel (vache, cochon, etc.)
      const currentType = animations.value[currentIndex.value]?.name.split('_')[0];
      console.log('Type actuel:', currentType);
      
      // Filtrer les animations du même type
      const filteredAnimations = animations.value.filter(anim => {
        const animType = anim.name.split('_')[0];
        return animType === currentType;
      });
      
      // Trier pour avoir d'abord l'animé, puis le réel
      const sortedAnimations = filteredAnimations.sort((a, b) => {
        if (a.name.includes('_anime')) return -1;
        if (b.name.includes('_anime')) return 1;
        return 0;
      });
      
      console.log('Animations filtrées et triées:', sortedAnimations);
      return sortedAnimations;
    });

    const currentSound = computed(() => {
      if (!currentAnimations.value.length) return null;
      
      const soundPath = currentAnimations.value[0]?.soundPath;
      console.log('Chemin du son brut:', soundPath);
      if (!soundPath) {
        console.log('Pas de chemin de son disponible');
        return null;
      }
      const fullPath = `http://192.168.1.137:3000${soundPath}`;
      console.log('Chemin du son final:', fullPath);
      return fullPath;
    });

    const getImagePath = (path) => {
      if (!path) return '';
      return `http://192.168.1.137:3000${path}`;
    };

    const fetchAnimations = async () => {
      try {
        console.log('Début de fetchAnimations');
        console.log('Token:', localStorage.getItem('token'));
        console.log('Theme ID:', route.params.themeId);
        
        const response = await axios.get(`http://192.168.1.137:3000/api/themes/${route.params.themeId}/animations`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        console.log('Réponse reçue:', response.data);
        animations.value = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des animations:', error);
        console.error('Détails de l\'erreur:', error.response?.data);
        error.value = error.response?.data?.error || 'Erreur lors de la récupération des animations';
      } finally {
        loading.value = false;
      }
    };

    const playSound = () => {
      if (audioPlayer.value) {
        console.log('Tentative de lecture du son:', currentSound.value);
        if (isPlaying.value) {
          console.log('Arrêt du son');
          audioPlayer.value.pause();
          audioPlayer.value.currentTime = 0;
        } else {
          console.log('Démarrage du son');
          audioPlayer.value.load(); // Recharger le son avant de le jouer
          audioPlayer.value.play().catch(error => {
            console.error('Erreur lors de la lecture du son:', error);
            error.value = 'Erreur lors de la lecture du son';
          });
        }
        isPlaying.value = !isPlaying.value;
      } else {
        console.error('Audio player non initialisé');
      }
    };

    const handleAudioEnded = () => {
      isPlaying.value = false;
      audioPlayer.value.currentTime = 0;
    };

    const nextAnimation = () => {
      if (currentIndex.value < animations.value.length - 1) {
        currentIndex.value += 1;
        if (isPlaying.value) {
          playSound(); // Arrêter le son en cours
        }
      }
    };

    const previousAnimation = () => {
      if (currentIndex.value > 0) {
        currentIndex.value -= 1;
        if (isPlaying.value) {
          playSound(); // Arrêter le son en cours
        }
      }
    };

    const goBack = () => {
      router.push('/themes');
    };

    onMounted(fetchAnimations);

    return {
      themeName,
      animations,
      currentAnimations,
      currentIndex,
      loading,
      error,
      currentSound,
      audioPlayer,
      isPlaying,
      playSound,
      nextAnimation,
      previousAnimation,
      goBack,
      getImagePath,
      handleAudioEnded
    };
  }
};
</script>

<style scoped>
.animation-viewer {
  min-height: 100vh;
  padding: var(--spacing-lg) 0;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-md);
  color: var(--primary-color);
}

h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
}

.back-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-xl);
}

.back-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 1.1rem;
  background-color: var(--primary-light);
  border: 2px solid var(--primary-color);
  border-radius: var(--border-radius-lg);
  transition: all var(--transition-normal);
  color: var(--text-light);
}

.back-button:hover {
  background-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.back-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.animations-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.animation-image {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
}

.controls {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md);
  background-color: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  position: sticky;
  bottom: var(--spacing-md);
  z-index: 100;
}

.loading {
  text-align: center;
  color: var(--primary-color);
  font-size: 1.2rem;
  padding: var(--spacing-xl);
}
</style> 