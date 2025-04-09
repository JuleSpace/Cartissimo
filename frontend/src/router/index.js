import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from 'vuex';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/themes',
    name: 'Themes',
    component: () => import('../components/ThemeList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/themes/:themeId/animations',
    name: 'Animations',
    component: () => import('../components/AnimationViewer.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !store.getters['auth/isAuthenticated']) {
    next('/');
  } else {
    next();
  }
});

export default router; 