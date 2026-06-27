import { createRouter, createWebHistory } from 'vue-router'
import { requiresAuth, requiresGuest } from './guards'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      beforeEnter: [requiresGuest],
      component: () => import('@/views/auth/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      beforeEnter: [requiresGuest],
      component: () => import('@/views/auth/RegisterView.vue'),
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('@/views/auth/VerifyEmailView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      beforeEnter: [requiresGuest],
      component: () => import('@/views/auth/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/auth/ResetPasswordView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      beforeEnter: [requiresAuth],
      component: () => import('@/views/profile/ProfileView.vue'),
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      beforeEnter: [requiresAuth],
      component: () => import('@/views/admin/UsersListView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login',
    },
  ],
})

export default router
