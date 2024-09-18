import { createRouter,createWebHashHistory } from 'vue-router'
import MainView from '../views/Main.vue'
import Login from '../views/login.vue'
const routes = [
    { path: '/login',name: 'login',component:Login },
    { path: '/',component:MainView,name:'home1',redirect: '/home',children: []}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
  })
  
export default router