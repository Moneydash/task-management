import { createRouter, createWebHistory } from 'vue-router'
import { requireAuth, requireRole } from '@/utils/authGuard'

import Landing from '@/pages/Landing.vue'
import Register from '@/pages/Register.vue'
import Login from '@/pages/Login.vue'
import Dashboard from '@/pages/Dashboard.vue'
import Todo from '@/pages/Todo.vue'
import Unauthorized from '@/pages/Unauthorized.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Landing,
    },
    {
      path: '/register',
      name: 'register',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
      beforeEnter: requireRole(['Admin'])
    },
    {
      path: '/todo',
      name: 'todo',
      component: Todo,
      meta: { requiresAuth: true },
      beforeEnter: requireRole(['User'])
    },
    {
      path: '/unauthorized',
      name: 'unauthorized',
      component: Unauthorized,
    },
  ],
})

export default router
