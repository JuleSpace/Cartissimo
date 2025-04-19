<template>
  <div class="animation-form">
    <h3>Animation {{ index + 1 }}</h3>
    <div class="form-group">
      <label :for="'name-' + index">Nom de l'animation</label>
      <input 
        :id="'name-' + index"
        v-model="animation.name"
        type="text"
        required
        @input="updateAnimation"
      >
    </div>

    <div class="form-group">
      <label :for="'description-' + index">Description</label>
      <textarea 
        :id="'description-' + index"
        v-model="animation.description"
        required
        @input="updateAnimation"
      ></textarea>
    </div>

    <div class="form-group">
      <label :for="'category-' + index">Catégorie</label>
      <input 
        :id="'category-' + index"
        v-model="animation.category"
        type="text"
        placeholder="Ex: animaux, vehicules, objets, actions"
        @input="updateAnimation"
      >
    </div>

    <div class="form-group">
      <label :for="'animatedGif-' + index">GIF animé</label>
      <input 
        :id="'animatedGif-' + index"
        type="file"
        accept=".gif"
        @change="(e) => handleFileChange(e, 'animatedGif')"
        required
      >
    </div>

    <div class="form-group">
      <label :for="'realGif-' + index">GIF réel</label>
      <input 
        :id="'realGif-' + index"
        type="file"
        accept=".gif"
        @change="(e) => handleFileChange(e, 'realGif')"
        required
      >
    </div>

    <div class="form-group">
      <label :for="'sound-' + index">Son</label>
      <input 
        :id="'sound-' + index"
        type="file"
        accept=".mp3"
        @change="(e) => handleFileChange(e, 'sound')"
        required
      >
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'AnimationForm',
  props: {
    modelValue: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const animation = ref({ ...props.modelValue });

    const handleFileChange = (event, type) => {
      const file = event.target.files[0];
      console.log(`Fichier ${type} sélectionné:`, file);
      
      if (file) {
        animation.value[type] = file;
        console.log(`Animation après mise à jour du ${type}:`, animation.value);
        emit('update:modelValue', animation.value);
      }
    };

    const updateAnimation = () => {
      emit('update:modelValue', { ...animation.value });
    };

    watch(() => props.modelValue, (newValue) => {
      animation.value = { ...newValue };
    });

    return {
      animation,
      updateAnimation,
      handleFileChange
    };
  }
};
</script>

<style scoped>
.animation-form {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

input, textarea, select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #4B95DE;
}
</style> 