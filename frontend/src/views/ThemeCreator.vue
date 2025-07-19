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

      <div class="form-group">
        <label for="themeImage">Image du thème</label>
        <div class="file-upload-area">
          <input 
            id="themeImage" 
            type="file" 
            accept="image/*"
            @change="handleImageUpload"
            ref="imageInput"
          >
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="Aperçu" class="preview-img">
            <button type="button" @click="removeImage" class="remove-image">×</button>
          </div>
          <div v-else class="upload-placeholder">
            <i class="fas fa-image"></i>
            <p>Cliquez pour ajouter une image de thème<br>
            <small>(JPG, PNG, GIF - Max 5MB)</small></p>
          </div>
        </div>
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
      description: '',
      image: null
    });
    const animations = ref([]);
    const error = ref('');
    const imagePreview = ref('');
    const imageInput = ref(null);

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

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        // Vérifier la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          error.value = 'L\'image ne peut pas dépasser 5MB';
          return;
        }
        
        // Vérifier le type
        if (!file.type.startsWith('image/')) {
          error.value = 'Seuls les fichiers image sont acceptés';
          return;
        }

        theme.value.image = file;
        
        // Créer un aperçu
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
        
        error.value = '';
      }
    };

    const removeImage = () => {
      theme.value.image = null;
      imagePreview.value = '';
      if (imageInput.value) {
        imageInput.value.value = '';
      }
    };

    const createTheme = async () => {
      try {
        // Préparer les données avec l'image si nécessaire
        let themeData;
        
        if (theme.value.image) {
          // Si il y a une image, utiliser FormData
          themeData = new FormData();
          themeData.append('name', theme.value.name);
          themeData.append('description', theme.value.description);
          themeData.append('image', theme.value.image);
        } else {
          // Si pas d'image, envoyer les données normalement
          themeData = {
            name: theme.value.name,
            description: theme.value.description
          };
        }
        
        // Créer d'abord le thème
        const createdTheme = await store.dispatch('themes/createTheme', themeData);
        
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
      imagePreview,
      imageInput,
      createTheme,
      goBack,
      addAnimation,
      handleImageUpload,
      removeImage
    };
  }
};
</script>

<style scoped>
.theme-creator {
  padding: 0.5rem;
  max-width: 1200px;
  margin: 120px auto 0;
}

@media (min-width: 768px) {
  .theme-creator {
    margin: 100px auto 0;
  }
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

/* Styles pour l'upload d'image */
.file-upload-area {
  position: relative;
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  transition: border-color 0.3s;
}

.file-upload-area:hover {
  border-color: #4B95DE;
}

.file-upload-area input[type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.upload-placeholder {
  color: #666;
  pointer-events: none;
}

.upload-placeholder i {
  font-size: 2rem;
  color: #ddd;
  margin-bottom: 10px;
}

.upload-placeholder small {
  color: #999;
}

.image-preview {
  position: relative;
  display: inline-block;
  max-width: 300px;
}

.preview-img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-image:hover {
  background: #ff3838;
}

.error-message {
  color: red;
  margin-top: 20px;
}
</style> 