<template>
  <div class="theme-creator">
    <div class="header">
      <button @click="goBack" class="btn-secondary">
        <i class="fas fa-arrow-left"></i> Retour aux thèmes
      </button>
      <h1>Créer une nouvelle série</h1>
    </div>
    
    <form @submit.prevent="createTheme" class="theme-form">
      <div class="form-group">
        <label for="name">Nom de la série</label>
        <input 
          id="name" 
          v-model="theme.name" 
          type="text" 
          required
        >
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          v-model="theme.description" 
          required
        ></textarea>
      </div>

      <div class="animations-section">
        <h2>Animations</h2>
        <p class="info-text">Ajoutez jusqu'à 10 animations pour cette série.</p>
        
        <div v-for="(animation, index) in animations" :key="index">
          <AnimationForm
            v-model="animations[index]"
            :index="index"
          />
        </div>

        <button 
          type="button" 
          class="btn-secondary" 
          @click="addAnimation"
          :disabled="animations.length >= 10"
        >
          <i class="fas fa-plus"></i> Ajouter une animation
        </button>
      </div>

      <button type="submit" class="btn-primary">Créer la série</button>
    </form>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import AnimationForm from '@/components/AnimationForm.vue';

export default {
  name: 'ThemeCreator',
  components: {
    AnimationForm
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const theme = ref({
      name: '',
      description: ''
    });
    const animations = ref([]);
    const error = ref('');

    const goBack = () => {
      router.push('/themes');
    };

    const addAnimation = () => {
      if (animations.value.length < 10) {
        animations.value.push({
          name: '',
          description: '',
          category: '',
          status: 'pending',
          duration: 2000,
          width: 300,
          height: 300
        });
      }
    };

    const createTheme = async () => {
      try {
        // Créer d'abord le thème
        const createdTheme = await store.dispatch('themes/createTheme', theme.value);
        
        if (!createdTheme || !createdTheme.id) {
          throw new Error('Erreur lors de la création du thème : ID manquant');
        }
        
        console.log('Thème créé avec succès:', createdTheme);
        
        // Ensuite, créer les animations pour ce thème
        for (const animation of animations.value) {
          console.log('Animation à créer:', animation);
          
          const formData = new FormData();
          formData.append('name', animation.name);
          formData.append('description', animation.description);
          formData.append('themeId', createdTheme.id);
          formData.append('category', animation.category);
          
          // Vérification des fichiers
          if (animation.animatedGif) {
            console.log('GIF animé trouvé:', animation.animatedGif.name);
            formData.append('animatedGif', animation.animatedGif);
          } else {
            console.warn('GIF animé manquant');
          }
          
          if (animation.realGif) {
            console.log('GIF réel trouvé:', animation.realGif.name);
            formData.append('realGif', animation.realGif);
          } else {
            console.warn('GIF réel manquant');
          }
          
          if (animation.sound) {
            console.log('Son trouvé:', animation.sound.name);
            formData.append('sound', animation.sound);
          } else {
            console.warn('Son manquant');
          }
          
          console.log('Création de l\'animation avec le thème ID:', createdTheme.id);
          await store.dispatch('animations/createAnimation', formData);
        }
        
        router.push('/themes');
      } catch (err) {
        console.error('Erreur lors de la création:', err);
        error.value = err.message;
      }
    };

    return {
      theme,
      animations,
      error,
      createTheme,
      goBack,
      addAnimation
    };
  }
};
</script>

<style scoped>
.theme-creator {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  margin-left: 20px;
  margin-bottom: 0;
}

.theme-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.animations-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
}

.info-text {
  color: #666;
  margin-bottom: 20px;
}

input, textarea, select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-primary {
  background-color: #4B95DE;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: red;
  margin-top: 20px;
}
</style> 