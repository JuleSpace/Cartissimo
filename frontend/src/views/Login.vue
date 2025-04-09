<template>
  <div class="login-container">
    <form class="login-form" @submit.prevent="handleSubmit">
      <h2>Connexion</h2>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          placeholder="Entrez votre email"
        >
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          placeholder="Entrez votre mot de passe"
        >
      </div>
      <button type="submit" class="submit-button" :disabled="loading">
        {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
      </button>
      <p v-if="error" class="error-message">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref('');

    const handleSubmit = async () => {
      try {
        console.log('Tentative de connexion avec:', { email: email.value, password: password.value });
        loading.value = true;
        error.value = '';
        
        console.log('Envoi de la requête au store...');
        await store.dispatch('auth/login', {
          email: email.value,
          password: password.value
        });
        
        console.log('Connexion réussie, vérification de l\'état d\'authentification...');
        console.log('Token dans le store:', store.state.auth.token);
        console.log('Utilisateur dans le store:', store.state.auth.user);
        
        console.log('Tentative de redirection vers /themes...');
        await router.push('/themes');
        console.log('Redirection effectuée');
      } catch (err) {
        console.error('Erreur de connexion:', err);
        console.error('Message d\'erreur:', err.message);
        console.error('Réponse d\'erreur:', err.response?.data);
        error.value = err.response?.data?.message || 'Erreur de connexion. Veuillez vérifier vos identifiants.';
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      loading,
      error,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: var(--spacing-xl);
  background-color: var(--bg-primary);
}

.login-form {
  background: var(--bg-secondary);
  padding: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  color: var(--blue);
  margin-bottom: var(--spacing-xl);
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  color: var(--text-primary);
  font-weight: 500;
  font-size: 1rem;
}

.form-group input {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--blue-light);
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  transition: var(--transition-fast);
  background-color: white;
}

.form-group input:focus {
  outline: none;
  border-color: var(--blue);
  box-shadow: var(--shadow-sm);
}

.form-group input::placeholder {
  color: #999;
}

.submit-button {
  width: 100%;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--blue) 100%);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
  margin-top: var(--spacing-lg);
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.submit-button:disabled {
  background: linear-gradient(135deg, #ccc 0%, #999 100%);
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: var(--coral);
  margin-top: var(--spacing-md);
  font-size: 0.9rem;
  text-align: center;
}
</style> 