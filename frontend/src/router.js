import { createMemoryHistory, createRouter } from 'vue-router'

import LoginView from './vues/Login.vue'
import GardenView from './vues/Garden.vue'
import ZoneView from './vues/ZoneInfo.vue'

const routes = [
  { path: '/', component: ZoneView },
  { path: '/login', component: LoginView },
  { path: '/garden', component: GardenView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
