import { createWebHistory, createRouter } from 'vue-router'

import LoginView from './vues/Login.vue'
import GardenView from './vues/Garden.vue'
import ZoneView from './vues/ZoneInfo.vue'
import dev from './vues/dev.vue'

const routes = [
  { path: '/', component: ZoneView },
  { path: '/login', component: LoginView },
  { path: '/garden', component: GardenView },
  { path: '/dev', component: dev }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
