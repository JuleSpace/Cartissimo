<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <img src="http://192.168.1.137:3000/public/images/logo.png" alt="Logo Cartissimo" class="logo">
      <h1>Cartissimo</h1>
    </div>
    <div class="navbar-menu">
      <button v-if="isAuthenticated" @click="logout" class="btn btn-primary logout-button">
        <span class="icon">&#x2716;</span>
        Se déconnecter
      </button>
    </div>
  </nav>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  name: 'Navbar',
  setup() {
    const store = useStore();
    const router = useRouter();

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

    const logout = async () => {
      await store.dispatch('auth/logout');
      router.push('/');
    };

    return {
      isAuthenticated,
      logout
    };
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--blue) 100%);
  color: var(--text-light);
  box-shadow: var(--shadow-md);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
}

.navbar + * {
  margin-top: 64px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.logo {
  height: 40px;
  width: 40px;
  object-fit: contain;
  border-radius: var(--border-radius-lg);
  background-color: var(--bg-secondary);
  padding: var(--spacing-xs);
  box-shadow: var(--shadow-sm);
}

.navbar-brand h1 {
  margin: 0;
  color: var(--text-light);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: linear-gradient(135deg, var(--coral) 0%, var(--mint) 100%);
  color: var(--text-light);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  font-size: 1rem;
  transition: var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.logout-button:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  opacity: 0.95;
}

.icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .navbar {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .logo {
    height: 32px;
    width: 32px;
  }

  .navbar-brand h1 {
    font-size: 1.2rem;
  }

  .logout-button {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.9rem;
  }

  .icon {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .navbar-brand {
    gap: var(--spacing-sm);
  }

  .logo {
    height: 28px;
    width: 28px;
    padding: var(--spacing-xs);
  }

  .navbar-brand h1 {
    font-size: 1rem;
  }

  .logout-button {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.85rem;
  }

  .navbar + * {
    margin-top: 56px;
  }
}
</style> 