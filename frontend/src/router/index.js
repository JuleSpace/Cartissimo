import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import Login from '../views/Login.vue';
import ThemeList from '../views/ThemeList.vue';
import AnimationViewer from '../views/AnimationViewer.vue';
import ThemeCreator from '../views/ThemeCreator.vue';
import AdminPanel from '../views/AdminPanel.vue';
import ThemeAccessManager from '../views/ThemeAccessManager.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/themes',
    name: 'Themes',
    component: ThemeList,
    meta: { requiresAuth: true }
  },
  {
    path: '/themes/create',
    name: 'ThemeCreator',
    component: ThemeCreator,
    meta: { 
      requiresAuth: true,
      requiresRole: 'orthophonist'
    }
  },
  {
    path: '/admin',
    name: 'AdminPanel',
    component: AdminPanel,
    meta: { 
      requiresAuth: true,
      requiresRole: 'admin'
    }
  },
  {
    path: '/themes/:themeId/animations',
    name: 'Animations',
    component: AnimationViewer,
    meta: { requiresAuth: true }
  },
  {
    path: '/themes/:themeId/access',
    name: 'ThemeAccess',
    component: ThemeAccessManager,
    meta: { 
      requiresAuth: true,
      requiresRole: 'orthophonist'
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated'];
  const userRole = store.getters['auth/userRole'];

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/');
  } else if (to.meta.requiresRole && to.meta.requiresRole !== userRole) {
    next('/themes');
  } else {
    next();
  }
});

export default router; 