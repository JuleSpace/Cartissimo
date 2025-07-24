<template>
  <div class="mobile-animation-viewer">
    <div class="mobile-animation-container">
      <!-- Affichage de l'animation courante -->
      <div class="mobile-animation-display">
        <div class="mobile-animation-header">
          <h3 class="mobile-animation-title">
            {{ currentStep === 'animated' ? 'Version animée' : 'Version réelle' }}
          </h3>
          <div class="mobile-step-indicator">
            <span class="step-dot" :class="{ active: currentStep === 'animated' }"></span>
            <span class="step-dot" :class="{ active: currentStep === 'real' }"></span>
          </div>
        </div>
        
        <div class="mobile-animation-image-container">
          <img 
            v-if="currentStep === 'animated' && currentAnimation?.animatedGifPath"
            :src="getImagePath(currentAnimation.animatedGifPath)" 
            :alt="currentAnimation.name + ' (animé)'" 
            class="mobile-animation-image"
          />
          <img 
            v-else-if="currentStep === 'real' && currentAnimation?.realGifPath"
            :src="getImagePath(currentAnimation.realGifPath)" 
            :alt="currentAnimation.name + ' (réel)'" 
            class="mobile-animation-image"
          />
        </div>
      </div>

      <!-- Contrôles mobiles -->
      <div class="mobile-controls">
        <div class="mobile-controls-row">
          <button 
            @click="playSound" 
            class="mobile-control-button sound-button"
            :disabled="!currentSound"
          >
            <span class="icon">🔊</span>
            Son
          </button>
          
          <button 
            @click="nextStep" 
            class="mobile-control-button next-button"
            :disabled="currentStep === 'real' && !hasNext"
          >
            <span class="icon">→</span>
            {{ currentStep === 'animated' ? 'Version réelle' : 'Suivant' }}
          </button>
        </div>
        
        <div class="mobile-controls-row">
          <button 
            @click="previousAnimation" 
            :disabled="!hasPrevious"
            class="mobile-control-button nav-button"
          >
            <span class="icon">←</span>
            Précédent
          </button>
          
          <button 
            @click="nextAnimation" 
            :disabled="!hasNext"
            class="mobile-control-button nav-button"
          >
            <span class="icon">→</span>
            Suivant
          </button>
        </div>
        
        <div class="mobile-controls-row">
          <button 
            @click="goBack" 
            class="mobile-control-button back-button full-width"
          >
            <span class="icon">⌂</span>
            Retour aux thèmes
          </button>
        </div>
      </div>

      <!-- Indicateur de progression -->
      <div class="mobile-progress">
        <div class="progress-text">
          Animation {{ currentAnimationIndex + 1 }} sur {{ totalAnimations }}
        </div>
        <div class="progress-bar">
          <div 
            class="progress-fill" 
            :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'MobileAnimationViewer',
  props: {
    currentAnimation: {
      type: Object,
      required: true
    },
    animations: {
      type: Array,
      required: true
    },
    currentAnimationIndex: {
      type: Number,
      required: true
    },
    getImagePath: {
      type: Function,
      required: true
    },
    currentSound: {
      type: String,
      default: null
    },
    audioPlayer: {
      type: Object,
      default: null
    }
  },
  emits: ['play-sound', 'next-animation', 'previous-animation', 'go-back'],
  setup(props, { emit }) {
    const currentStep = ref('animated') // 'animated' ou 'real'
    
    const totalAnimations = computed(() => props.animations.length)
    
    const hasPrevious = computed(() => {
      return props.currentAnimationIndex > 0 || currentStep.value === 'real'
    })
    
    const hasNext = computed(() => {
      return props.currentAnimationIndex < totalAnimations.value - 1
    })
    
    const progressPercentage = computed(() => {
      if (totalAnimations.value === 0) return 0
      const animationProgress = (props.currentAnimationIndex / totalAnimations.value) * 100
      const stepProgress = currentStep.value === 'real' ? 50 / totalAnimations.value : 0
      return Math.min(100, animationProgress + stepProgress)
    })
    
    const playSound = () => {
      emit('play-sound')
    }
    
    const nextStep = () => {
      if (currentStep.value === 'animated') {
        currentStep.value = 'real'
      } else {
        // Passer à l'animation suivante et revenir à la version animée
        if (hasNext.value) {
          currentStep.value = 'animated'
          emit('next-animation')
        }
      }
    }
    
    const previousAnimation = () => {
      if (currentStep.value === 'real') {
        currentStep.value = 'animated'
      } else {
        // Revenir à l'animation précédente et aller à la version réelle
        if (props.currentAnimationIndex > 0) {
          currentStep.value = 'real'
          emit('previous-animation')
        }
      }
    }
    
    const nextAnimation = () => {
      emit('next-animation')
    }
    
    const goBack = () => {
      emit('go-back')
    }
    
    // Réinitialiser à la version animée quand on change d'animation
    watch(() => props.currentAnimationIndex, () => {
      if (currentStep.value === 'real') {
        // Si on était sur la version réelle, on peut rester dessus
        // Sinon on repart sur animée
      }
    })
    
    return {
      currentStep,
      totalAnimations,
      hasPrevious,
      hasNext,
      progressPercentage,
      playSound,
      nextStep,
      previousAnimation,
      nextAnimation,
      goBack
    }
  }
}
</script>

<style scoped>
.mobile-animation-viewer {
  padding: 10px;
  min-height: 100vh;
  background: var(--bg-primary);
}

.mobile-animation-container {
  max-width: 100%;
  margin: 0 auto;
}

.mobile-animation-display {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: var(--shadow-sm);
}

.mobile-animation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.mobile-animation-title {
  color: var(--blue);
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
}

.mobile-step-indicator {
  display: flex;
  gap: 8px;
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #E0E0E0;
  transition: background 0.3s ease;
}

.step-dot.active {
  background: var(--mint);
}

.mobile-animation-image-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 10px;
}

.mobile-animation-image {
  max-width: 100%;
  max-height: 300px;
  object-fit: contain;
  border-radius: 8px;
}

.mobile-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.mobile-controls-row {
  display: flex;
  gap: 10px;
}

.mobile-control-button {
  flex: 1;
  padding: 15px 10px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 50px;
}

.sound-button {
  background: #FFD75C;
  color: #2C3E50;
  box-shadow: 0 2px 8px rgba(255, 215, 92, 0.3);
}

.sound-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 215, 92, 0.4);
}

.next-button {
  background: linear-gradient(135deg, #7FD1F4 0%, #4B95DE 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(75, 149, 222, 0.3);
}

.next-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(75, 149, 222, 0.4);
}

.nav-button {
  background: linear-gradient(135deg, #FF8A80 0%, #FF5722 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(255, 87, 34, 0.3);
}

.nav-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.4);
}

.back-button {
  background: linear-gradient(135deg, #A5D6A7 0%, #66BB6A 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 187, 106, 0.3);
}

.back-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.4);
}

.full-width {
  flex: none !important;
  width: 100% !important;
}

.mobile-control-button:disabled {
  background: #E0E0E0;
  color: #9E9E9E;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.7;
}

.mobile-progress {
  background: var(--bg-secondary);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.progress-text {
  color: var(--text-primary);
  font-size: 0.9rem;
  margin-bottom: 10px;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #E0E0E0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--mint) 0%, var(--blue) 100%);
  transition: width 0.3s ease;
  border-radius: 3px;
}

.icon {
  font-size: 1.1rem;
}
</style> 