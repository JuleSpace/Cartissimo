<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <img :src="logoUrl" alt="Logo Cartissimo" class="logo">
      <h1>Cartissimo</h1>
    </div>
    <div class="navbar-menu">
      <div v-if="isAuthenticated" class="user-info">
        <button @click="goToProfile" class="btn btn-secondary profile-button">
          <i class="fas fa-user"></i>
          Mon Profil
        </button>
        <button @click="logout" class="btn btn-primary logout-button">
        <span class="icon">&#x2716;</span>
        Se déconnecter
      </button>
      </div>
    </div>
  </nav>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { SERVER_BASE_URL } from '@/config';

export default {
  name: 'Navbar',
  setup() {
    const store = useStore();
    const router = useRouter();

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);
    const currentUser = computed(() => store.getters['auth/currentUser']);
    const logoUrl = computed(() => `${SERVER_BASE_URL}/public/images/logo.png`);

    const logout = async () => {
      await store.dispatch('auth/logout');
      router.push('/');
    };

    const goToProfile = () => {
      router.push('/profile');
    };

    return {
      isAuthenticated,
      currentUser,
      logout,
      goToProfile,
      logoUrl
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

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.profile-button {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.profile-button:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-1px);
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

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
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

  .user-info {
    gap: var(--spacing-sm);
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

  .user-info {
    gap: var(--spacing-xs);
  }
}
</style> 