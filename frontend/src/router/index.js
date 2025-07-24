import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import ThemeList from '../views/ThemeList.vue';
import AnimationViewer from '../views/AnimationViewer.vue';
import ThemeCreator from '../views/ThemeCreator.vue';
import AdminPanel from '../views/AdminPanel.vue';
import ThemeAccessManager from '../views/ThemeAccessManager.vue';
import DashboardOrthophonistes from '@/views/DashboardOrthophonistes.vue';
import UserProfile from '../views/UserProfile.vue';
import PaymentSuccess from '../views/PaymentSuccess.vue';
import PaymentCancel from '../views/PaymentCancel.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
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
  },
  {
  path: '/dashboard',
  name: 'DashboardOrthophonistes',
  component: DashboardOrthophonistes
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/payment/success',
    name: 'PaymentSuccess',
    component: PaymentSuccess,
    meta: { requiresAuth: true }
  },
  {
    path: '/payment/cancel',
    name: 'PaymentCancel',
    component: PaymentCancel,
    meta: { requiresAuth: true }
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