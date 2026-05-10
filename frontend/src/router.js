import { createWebHistory, createRouter } from 'vue-router'
import { authGuard } from '@auth0/auth0-vue'

import LoginView from './vues/Login.vue'
import GardenView from './vues/Garden.vue'
import ZoneView from './vues/ZoneInfo.vue'
import dev from './vues/dev.vue'
import chat from './vues/chat.vue'

const routes = [
  { path: '/', component: ZoneView },
  { path: '/login', component: LoginView },
  { path: '/garden', component: GardenView, beforeEnter: authGuard },
  { path: '/dev', component: dev },
  { path: '/chat', component: chat, beforeEnter: authGuard }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
