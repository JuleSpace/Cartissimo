<template>
  <div class="theme-order-manager">
    <h2>Gestion de l'ordre des thèmes</h2>
    <p class="description">
      Définissez l'ordre des thèmes pour le déverrouillage progressif des parents.
      Les 2 premiers thèmes sont automatiquement débloqués, puis les suivants se débloquent un par un.
    </p>

    <div v-if="loading" class="loading">
      Chargement des thèmes...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else class="themes-container">
      <div class="themes-list">
        <h3>Ordre actuel des thèmes</h3>
        <div class="theme-item-container">
          <div 
            v-for="(theme, index) in themes" 
            :key="theme.id"
            class="theme-item"
            :class="{ 'first-two': index < 2 }"
            draggable="true"
            @dragstart="dragStart(index)"
            @dragover.prevent
            @drop="dragDrop(index)"
          >
            <div class="theme-order">{{ index + 1 }}</div>
            <div class="theme-info">
              <h4>{{ theme.name }}</h4>
              <p>{{ theme.description }}</p>
            </div>
            <div class="theme-actions">
              <button 
                @click="moveUp(index)" 
                :disabled="index === 0"
                class="btn-move"
              >
                ▲
              </button>
              <button 
                @click="moveDown(index)" 
                :disabled="index === themes.length - 1"
                class="btn-move"
              >
                ▼
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="save-section">
        <button 
          @click="saveOrder" 
          class="btn-save"
          :disabled="!hasChanges || saving"
        >
          {{ saving ? 'Sauvegarde...' : 'Sauvegarder l\'ordre' }}
        </button>
        <button 
          @click="resetOrder" 
          class="btn-reset"
          :disabled="!hasChanges"
        >
          Annuler les modifications
        </button>
      </div>

      <div class="info-section">
        <h3>Information sur le déverrouillage</h3>
        <div class="unlock-info">
          <div class="unlock-item auto">
            <span class="indicator"></span>
            <span>Thèmes 1 & 2 : Débloqués automatiquement pour tous les parents</span>
          </div>
          <div class="unlock-item progressive">
            <span class="indicator"></span>
            <span>Thèmes 3+ : Débloqués progressivement après complétion du thème précédent</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { API_URL } from '@/config';

export default {
  name: 'ThemeOrderManager',
  setup() {
    const store = useStore();
    const themes = ref([]);
    const originalOrder = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const saving = ref(false);
    const draggedIndex = ref(null);

    const hasChanges = computed(() => {
      return JSON.stringify(themes.value.map(t => t.id)) !== 
             JSON.stringify(originalOrder.value.map(t => t.id));
    });

    const fetchThemes = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const response = await fetch(`${API_URL}/themes/admin/themes-order`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${store.state.auth.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors du chargement des thèmes');
        }

        const data = await response.json();
        themes.value = data.themes;
        originalOrder.value = JSON.parse(JSON.stringify(data.themes));
      } catch (err) {
        error.value = err.message;
      } finally {
        loading.value = false;
      }
    };

    const saveOrder = async () => {
      saving.value = true;
      
      try {
        const themeOrders = themes.value.map((theme, index) => ({
          id: theme.id,
          order: index + 1
        }));

        const response = await fetch(`${API_URL}/themes/admin/update-order`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${store.state.auth.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ themeOrders })
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la sauvegarde');
        }

        originalOrder.value = JSON.parse(JSON.stringify(themes.value));
        alert('Ordre des thèmes sauvegardé avec succès !');
      } catch (err) {
        error.value = err.message;
      } finally {
        saving.value = false;
      }
    };

    const resetOrder = () => {
      themes.value = JSON.parse(JSON.stringify(originalOrder.value));
    };

    const moveUp = (index) => {
      if (index > 0) {
        const newThemes = [...themes.value];
        [newThemes[index], newThemes[index - 1]] = [newThemes[index - 1], newThemes[index]];
        themes.value = newThemes;
      }
    };

    const moveDown = (index) => {
      if (index < themes.value.length - 1) {
        const newThemes = [...themes.value];
        [newThemes[index], newThemes[index + 1]] = [newThemes[index + 1], newThemes[index]];
        themes.value = newThemes;
      }
    };

    const dragStart = (index) => {
      draggedIndex.value = index;
    };

    const dragDrop = (index) => {
      if (draggedIndex.value !== null && draggedIndex.value !== index) {
        const newThemes = [...themes.value];
        const draggedTheme = newThemes[draggedIndex.value];
        newThemes.splice(draggedIndex.value, 1);
        newThemes.splice(index, 0, draggedTheme);
        themes.value = newThemes;
      }
      draggedIndex.value = null;
    };

    onMounted(fetchThemes);

    return {
      themes,
      loading,
      error,
      saving,
      hasChanges,
      fetchThemes,
      saveOrder,
      resetOrder,
      moveUp,
      moveDown,
      dragStart,
      dragDrop
    };
  }
};
</script>

<style scoped>
.theme-order-manager {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.description {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 30px;
  border-left: 4px solid #007bff;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
}

.error {
  color: #dc3545;
  background: #f8d7da;
  border-radius: 8px;
}

.themes-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  align-items: start;
}

.themes-list h3 {
  margin-bottom: 20px;
}

.theme-item-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.theme-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: move;
  transition: all 0.3s ease;
}

.theme-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
}

.theme-item.first-two {
  border-color: #28a745;
  background: #f8fff9;
}

.theme-item.first-two::before {
  content: "AUTO";
  background: #28a745;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.theme-order {
  background: #007bff;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.theme-info {
  flex: 1;
}

.theme-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.theme-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.theme-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.btn-move {
  background: #6c757d;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-move:hover:not(:disabled) {
  background: #5a6268;
}

.btn-move:disabled {
  background: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
}

.save-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  height: fit-content;
}

.btn-save, .btn-reset {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.btn-save {
  background: #28a745;
  color: white;
}

.btn-save:hover:not(:disabled) {
  background: #218838;
}

.btn-save:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.btn-reset {
  background: #dc3545;
  color: white;
}

.btn-reset:hover:not(:disabled) {
  background: #c82333;
}

.btn-reset:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.info-section {
  grid-column: 1 / -1;
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.unlock-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.unlock-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.unlock-item.auto .indicator {
  background: #28a745;
}

.unlock-item.progressive .indicator {
  background: #ffc107;
}

@media (max-width: 768px) {
  .themes-container {
    grid-template-columns: 1fr;
  }
  
  .theme-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .theme-actions {
    flex-direction: row;
    justify-content: center;
  }
}
</style> 