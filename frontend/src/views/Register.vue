<template>
  <div class="register-container">
    <form class="register-form" @submit.prevent="handleSubmit">
      <div class="form-header">
        <h2>Inscription Parent</h2>
        <p class="subtitle">Créez votre compte pour accéder aux thèmes éducatifs</p>
      </div>

      <!-- Section Parent -->
      <div class="form-section">
        <h3>
          <i class="fas fa-user"></i>
          Vos informations
        </h3>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="firstName">Prénom *</label>
            <input
              type="text"
              id="firstName"
              v-model="parentForm.firstName"
              required
              placeholder="Votre prénom"
            >
          </div>
          
          <div class="form-group">
            <label for="lastName">Nom *</label>
            <input
              type="text"
              id="lastName"
              v-model="parentForm.lastName"
              required
              placeholder="Votre nom"
            >
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input
            type="email"
            id="email"
            v-model="parentForm.email"
            required
            placeholder="votre@email.com"
          >
        </div>

        <div class="form-group">
          <label for="password">Mot de passe *</label>
          <input
            type="password"
            id="password"
            v-model="parentForm.password"
            required
            placeholder="Minimum 6 caractères"
            minlength="6"
          >
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmer le mot de passe *</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="parentForm.confirmPassword"
            required
            placeholder="Confirmez votre mot de passe"
          >
        </div>
      </div>

      <!-- Section Enfants -->
      <div class="form-section">
        <div class="section-header">
          <h3>
            <i class="fas fa-child"></i>
            Vos enfants ({{ children.length }})
          </h3>
          <button type="button" @click="addChild" class="btn-add-child">
            <i class="fas fa-plus"></i>
            Ajouter un enfant
          </button>
        </div>

        <div v-if="children.length === 0" class="empty-children">
          <i class="fas fa-child"></i>
          <p>Aucun enfant ajouté</p>
          <p class="text-sm">Vous devez ajouter au moins un enfant pour vous inscrire</p>
        </div>

        <div v-else class="children-list">
          <div v-for="(child, index) in children" :key="index" class="child-item">
            <div class="child-header">
              <h4>
                <i class="fas fa-child"></i>
                Enfant {{ index + 1 }}
              </h4>
              <button type="button" @click="removeChild(index)" class="btn-remove">
                <i class="fas fa-trash"></i>
              </button>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label :for="`child-firstName-${index}`">Prénom *</label>
                <input
                  type="text"
                  :id="`child-firstName-${index}`"
                  v-model="child.firstName"
                  required
                  placeholder="Prénom de l'enfant"
                >
              </div>

              <div class="form-group">
                <label :for="`child-lastName-${index}`">Nom *</label>
                <input
                  type="text"
                  :id="`child-lastName-${index}`"
                  v-model="child.lastName"
                  required
                  placeholder="Nom de l'enfant"
                >
              </div>
            </div>

            <div class="form-group">
              <label :for="`child-birthDate-${index}`">Date de naissance *</label>
              <input
                type="date"
                :id="`child-birthDate-${index}`"
                v-model="child.birthDate"
                required
                :max="maxDate"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Section Orthophoniste -->
      <div class="form-section">
        <h3>
          <i class="fas fa-user-md"></i>
          Orthophoniste (optionnel)
        </h3>
        
        <div class="form-group">
          <label for="orthophoniste">Sélectionner un orthophoniste</label>
          <select
            id="orthophoniste"
            v-model="parentForm.orthophonisteId"
          >
            <option value="">Aucun orthophoniste pour le moment</option>
            <option
              v-for="ortho in orthophonistes"
              :key="ortho.id"
              :value="ortho.id"
            >
              {{ ortho.firstName }} {{ ortho.lastName }} - {{ ortho.city }}
            </option>
          </select>
          <p class="help-text">
            <i class="fas fa-info-circle"></i>
            Vous pourrez modifier cette information plus tard dans votre profil
          </p>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button type="submit" class="submit-button" :disabled="loading || !isFormValid">
          <i v-if="loading" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-user-plus"></i>
          {{ loading ? 'Création du compte...' : 'Créer mon compte' }}
        </button>
        
        <div class="login-link">
          <p>Déjà inscrit ?</p>
          <router-link to="/" class="link">Se connecter</router-link>
        </div>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
      <p v-if="success" class="success-message">{{ success }}</p>
    </form>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { API_URL } from '@/config';

export default {
  name: 'Register',
  setup() {
    const router = useRouter();

    // États
    const loading = ref(false);
    const error = ref('');
    const success = ref('');
    const orthophonistes = ref([]);

    // Formulaire parent
    const parentForm = ref({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      orthophonisteId: ''
    });

    // Liste des enfants
    const children = ref([]);

    // Date max pour les enfants (aujourd'hui)
    const maxDate = computed(() => {
      return new Date().toISOString().split('T')[0];
    });

    // Validation du formulaire
    const isFormValid = computed(() => {
      return (
        parentForm.value.firstName &&
        parentForm.value.lastName &&
        parentForm.value.email &&
        parentForm.value.password &&
        parentForm.value.confirmPassword &&
        parentForm.value.password === parentForm.value.confirmPassword &&
        children.value.length > 0 &&
        children.value.every(child => 
          child.firstName && child.lastName && child.birthDate
        )
      );
    });

    // Charger les orthophonistes
    const loadOrthophonistes = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/orthophonistes`);
        orthophonistes.value = response.data;
        console.log('Orthophonistes chargés:', orthophonistes.value);
      } catch (err) {
        console.error('Erreur lors du chargement des orthophonistes:', err);
        console.error('Détails:', err.response?.data);
      }
    };

    // Gestion des enfants
    const addChild = () => {
      children.value.push({
        firstName: '',
        lastName: '',
        birthDate: ''
      });
    };

    const removeChild = (index) => {
      children.value.splice(index, 1);
    };

    // Soumission du formulaire
    const handleSubmit = async () => {
      try {
        loading.value = true;
        error.value = '';
        success.value = '';

        // Validation des mots de passe
        if (parentForm.value.password !== parentForm.value.confirmPassword) {
          error.value = 'Les mots de passe ne correspondent pas';
          return;
        }

        if (parentForm.value.password.length < 6) {
          error.value = 'Le mot de passe doit contenir au moins 6 caractères';
          return;
        }

        if (children.value.length === 0) {
          error.value = 'Vous devez ajouter au moins un enfant';
          return;
        }

        // Préparer les données pour l'API
        const registrationData = {
          email: parentForm.value.email,
          password: parentForm.value.password,
          firstName: parentForm.value.firstName,
          lastName: parentForm.value.lastName,
          children: children.value,
          orthophonisteId: parentForm.value.orthophonisteId || null
        };

        console.log('Données d\'inscription:', registrationData);

        // Envoyer la requête d'inscription
        const response = await axios.post(`${API_URL}/users/register`, registrationData);

        console.log('Inscription réussie:', response.data);

        // Sauvegarder le token
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        success.value = 'Inscription réussie ! Redirection...';
        
        // Rediriger vers la liste des thèmes après un court délai
        setTimeout(() => {
          router.push('/themes');
        }, 2000);

      } catch (err) {
        console.error('Erreur lors de l\'inscription:', err);
        error.value = err.response?.data?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
      } finally {
        loading.value = false;
      }
    };

    // Charger les orthophonistes au montage
    onMounted(() => {
      loadOrthophonistes();
      // Ajouter automatiquement un premier enfant
      addChild();
    });

    return {
      // États
      loading,
      error,
      success,
      orthophonistes,
      parentForm,
      children,
      maxDate,
      isFormValid,

      // Méthodes
      addChild,
      removeChild,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  background-color: var(--bg-primary);
}

.register-form {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h2 {
  color: var(--blue);
  margin-bottom: 8px;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.form-section {
  margin-bottom: 40px;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid var(--blue);
}

.form-section h3 {
  margin: 0 0 25px 0;
  color: #333;
  font-size: 1.3rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.section-header h3 {
  margin: 0;
}

.btn-add-child {
  background: var(--blue);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-add-child:hover {
  background: var(--blue-light);
  transform: translateY(-2px);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.form-group input, .form-group select {
  padding: 14px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: var(--blue);
  box-shadow: 0 0 0 3px rgba(75, 149, 222, 0.1);
}

.help-text {
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 5px;
}

.empty-children {
  text-align: center;
  padding: 40px;
  color: #666;
  background: white;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.empty-children i {
  font-size: 3rem;
  color: #ddd;
  margin-bottom: 15px;
}

.text-sm {
  font-size: 0.9rem;
}

.children-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.child-item {
  background: white;
  padding: 25px;
  border-radius: 12px;
  border: 2px solid #e1e5e9;
  transition: all 0.3s;
}

.child-item:hover {
  border-color: var(--blue-light);
  box-shadow: 0 4px 12px rgba(75, 149, 222, 0.1);
}

.child-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.child-header h4 {
  margin: 0;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-remove {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-remove:hover {
  background: #c82333;
}

.form-actions {
  text-align: center;
  margin-top: 40px;
}

.submit-button {
  width: 100%;
  max-width: 400px;
  padding: 16px 24px;
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--blue) 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 0 auto 20px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(75, 149, 222, 0.3);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.login-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.login-link p {
  margin: 0;
  color: #666;
}

.link {
  color: var(--blue);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.link:hover {
  color: var(--blue-light);
  text-decoration: underline;
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  border: 1px solid #ffcdd2;
}

.success-message {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 15px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  border: 1px solid #c8e6c9;
}

@media (max-width: 768px) {
  .register-container {
    padding: 20px 10px;
  }
  
  .register-form {
    padding: 30px 20px;
  }
  
  .form-header h2 {
    font-size: 2rem;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .child-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  .login-link {
    flex-direction: column;
    gap: 5px;
  }
}
</style> 