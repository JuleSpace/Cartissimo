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
    <div v-else-if="!hasAnimations" class="no-animations">
      <p>Aucune animation disponible pour ce thème.</p>
    </div>
    <div v-else-if="currentAnimations.length === 0" class="no-animations">
      <p>Aucune animation disponible pour ce type.</p>
    </div>
    <div v-else class="animations-container">
      <div class="grid grid-2">
        <div class="card">
          <h3>Version Animée</h3>
          <img 
            v-if="currentAnimations[0] && currentAnimations[0].animatedGifPath"
            :src="getImagePath(currentAnimations[0].animatedGifPath)" 
            :alt="currentAnimations[0].name + ' animé'"
            class="animation-image"
          >
          <p v-if="currentAnimations[0]">{{ currentAnimations[0].description }}</p>
        </div>
        <div class="card">
          <h3>Version Réelle</h3>
          <img 
            v-if="currentAnimations[0] && currentAnimations[0].realGifPath"
            :src="getImagePath(currentAnimations[0].realGifPath)" 
            :alt="currentAnimations[0].name + ' réel'"
            class="animation-image"
          >
          <p v-if="currentAnimations[0]">{{ currentAnimations[0].description }}</p>
        </div>
      </div>

      <div class="controls">
        <button 
          @click="previousAnimation" 
          :disabled="!canGoPrevious"
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
          :disabled="!canGoNext"
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
import { SERVER_BASE_URL, API_URL } from '@/config';

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
      try {
        console.log('Toutes les animations:', animations.value);
        
        // Vérifier si animations.value existe et a des éléments
        if (!animations.value || !Array.isArray(animations.value) || animations.value.length === 0) {
          console.log('Aucune animation disponible');
          return [];
        }
        
        // Vérifier si currentIndex est valide
        if (currentIndex.value < 0 || currentIndex.value >= animations.value.length) {
          console.log('Index invalide, réinitialisation à 0');
          currentIndex.value = 0;
        }
        
        // Trouver le type actuel (vache, cochon, etc.)
        const currentAnimation = animations.value[currentIndex.value];
        if (!currentAnimation || !currentAnimation.name) {
          console.log('Animation actuelle invalide');
          return [];
        }
        
        const currentType = currentAnimation.name.split('_')[0];
        console.log('Type actuel:', currentType);
        
        // Filtrer les animations du même type
        const filteredAnimations = animations.value.filter(anim => {
          if (!anim || !anim.name) return false;
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
      } catch (error) {
        console.error('Erreur dans currentAnimations:', error);
        return [];
      }
    });

    const currentSound = computed(() => {
      try {
        if (!currentAnimations.value || currentAnimations.value.length === 0) {
          console.log('Pas d\'animations disponibles pour le son');
          return null;
        }
        
        const firstAnimation = currentAnimations.value[0];
        if (!firstAnimation) {
          console.log('Pas d\'animation disponible pour le son');
          return null;
        }
        
        const soundPath = firstAnimation.soundPath;
        console.log('Chemin du son brut:', soundPath);
        if (!soundPath) {
          console.log('Pas de chemin de son disponible');
          return null;
        }
        const fullPath = `${SERVER_BASE_URL}${soundPath}`;
        console.log('Chemin du son final:', fullPath);
        return fullPath;
      } catch (error) {
        console.error('Erreur dans currentSound:', error);
        return null;
      }
    });

    const getImagePath = (path) => {
      try {
        if (!path) return '';
        return `${SERVER_BASE_URL}${path}`;
      } catch (error) {
        console.error('Erreur dans getImagePath:', error);
        return '';
      }
    };

    const fetchAnimations = async () => {
      try {
        console.log('Début de fetchAnimations');
        console.log('Token:', localStorage.getItem('token'));
        console.log('Theme ID:', route.params.themeId);
        
        // Réinitialiser les états
        loading.value = true;
        error.value = '';
        animations.value = [];
        currentIndex.value = 0;
        
        // Vérifier si le token existe
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Token d\'authentification manquant');
        }
        
        // Vérifier si l'ID du thème existe
        if (!route.params.themeId) {
          throw new Error('ID du thème manquant');
        }
        
        // Récupérer d'abord le thème pour avoir son nom
        const themeResponse = await axios.get(`${API_URL}/themes/${route.params.themeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (themeResponse.data && themeResponse.data.name) {
          themeName.value = themeResponse.data.name;
        }
        
        // Ensuite récupérer les animations
        const response = await axios.get(`${API_URL}/themes/${route.params.themeId}/animations`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Réponse reçue:', response.data);
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Format de réponse invalide');
        }
        
        // S'assurer que les animations sont valides avant de les assigner
        const validAnimations = response.data.filter(anim => 
          anim && 
          anim.name && 
          anim.animatedGifPath && 
          anim.realGifPath
        );
        
        animations.value = validAnimations;
        
        if (validAnimations.length === 0) {
          console.log('Aucune animation valide trouvée');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des animations:', error);
        console.error('Détails de l\'erreur:', error.response?.data);
        error.value = error.response?.data?.error || 'Erreur lors de la récupération des animations';
        animations.value = [];
      } finally {
        loading.value = false;
      }
    };

    const playSound = () => {
      if (!audioPlayer.value) {
        console.error('Audio player non initialisé');
        return;
      }
      
      console.log('Tentative de lecture du son:', currentSound.value);
      if (!currentSound.value) {
        console.error('Pas de son disponible');
        return;
      }
      
      if (isPlaying.value) {
        console.log('Arrêt du son');
        audioPlayer.value.pause();
        audioPlayer.value.currentTime = 0;
      } else {
        console.log('Démarrage du son');
        audioPlayer.value.load(); // Recharger le son avant de le jouer
        audioPlayer.value.play().catch(err => {
          console.error('Erreur lors de la lecture du son:', err);
          error.value = 'Erreur lors de la lecture du son';
        });
      }
      isPlaying.value = !isPlaying.value;
    };

    const handleAudioEnded = () => {
      isPlaying.value = false;
      if (audioPlayer.value) {
        audioPlayer.value.currentTime = 0;
      }
    };

    const nextAnimation = () => {
      if (!animations.value || !Array.isArray(animations.value) || animations.value.length === 0) {
        console.log('Pas d\'animations disponibles pour la navigation');
        return;
      }
      
      if (currentIndex.value < animations.value.length - 1) {
        currentIndex.value += 1;
        if (isPlaying.value) {
          playSound(); // Arrêter le son en cours
        }
      }
    };

    const previousAnimation = () => {
      if (!animations.value || !Array.isArray(animations.value) || animations.value.length === 0) {
        console.log('Pas d\'animations disponibles pour la navigation');
        return;
      }
      
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

    const canGoNext = computed(() => {
      try {
        return animations.value && 
               Array.isArray(animations.value) && 
               animations.value.length > 0 && 
               currentIndex.value < animations.value.length - 1;
      } catch (error) {
        console.error('Erreur dans canGoNext:', error);
        return false;
      }
    });

    const canGoPrevious = computed(() => {
      try {
        return animations.value && 
               Array.isArray(animations.value) && 
               animations.value.length > 0 && 
               currentIndex.value > 0;
      } catch (error) {
        console.error('Erreur dans canGoPrevious:', error);
        return false;
      }
    });

    const hasAnimations = computed(() => {
      try {
        return animations.value && 
               Array.isArray(animations.value) && 
               animations.value.length > 0;
      } catch (error) {
        console.error('Erreur dans hasAnimations:', error);
        return false;
      }
    });

    onMounted(() => {
      console.log('AnimationViewer monté');
      console.log('Route params:', route.params);
      fetchAnimations();
    });

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
      handleAudioEnded,
      canGoNext,
      canGoPrevious,
      hasAnimations
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

.no-animations {
  text-align: center;
  color: var(--text-color);
  font-size: 1.2rem;
  padding: var(--spacing-xl);
  background-color: var(--surface-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  margin: var(--spacing-xl) auto;
  max-width: 600px;
}
</style> 