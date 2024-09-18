import { createApp } from 'vue'

import App from './App.vue'


import router from './router'

import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'
import './assets/less/index.less'
// import './style.css'
import './api/mock.js'

const app = createApp(App)

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 挂載api配置
import api from './api/api'
app.config.globalProperties.$api = api
import store from './store/index.js'
store.commit('addMenu', router)
// if hasCheck not router path, So ,input path does not exist, return false
function checkRouter(path) {
    let hasCheck = router.getRoutes().filter(route => route.path == path).length
    if (hasCheck) {
        return true
    } else {
        return false
    }
}
// login surcess set token
// if not token or name not equal login ,jump login
// if hasCheck return false ,jump home
router.beforeEach((to, from, next) => {
    store.commit('getToken')
    const token = store.state.token
    if (!token && to.name != 'login') {
        next({ name: 'login' })
    } else if (!checkRouter(to.path)) {
        // debugger
        next({ name: 'home' })
    } else {
        next()
    }
})
app.use(router).use(ElementPlus).use(store)
app.mount('#app')
