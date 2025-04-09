<template>
  <div class="login-container">
    <h2>Connexion</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
        >
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
        >
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref('');

    const handleSubmit = async () => {
      try {
        loading.value = true;
        error.value = '';
        await store.dispatch('auth/login', {
          email: email.value,
          password: password.value
        });
        router.push('/themes');
      } catch (err) {
        error.value = err.message || 'Erreur de connexion';
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
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error {
  color: red;
  margin-top: 10px;
}
</style> 