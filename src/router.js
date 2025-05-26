import { createRouter, createWebHashHistory } from 'vue-router' 
import Leaderboard from './components/Leaderboard.vue'

const routes = [
  {
    path: '/',
    name: 'Leaderboard',
    component: Leaderboard,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router