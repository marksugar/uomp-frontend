import { createStore } from 'vuex'
import Cookie from 'js-cookie'
const module = import.meta.glob('../views/*/*vue')
export default createStore ({
    state: {
        isCollapse: true,
        currentMent: null,
        tabsList: [
            {
              path: '/',
              name: 'home',
              label: '首页',
              icon: 'home'
            }
          ],
          menu: [],
          token: '' ,
          username: '',
          user_id:''
    },
    mutations:{
        updateIsCollapse(state,payload) {
            state.isCollapse = !state.isCollapse
        },
        selectMenu(state,value) {
            // value.name == 'home' ? (state.currentMent = null) : (state.currentMent = value)
            if(value.name == 'home'){
                (state.currentMent = null)
            } else {
                state.currentMent = value
                let result = state.tabsList.findIndex(item => item.name === value.name)
                result == -1 ? state.tabsList.push(value) : ''
            }
        },
        closeTab(state, val) {
            let res = state.tabsList.findIndex(item => item.name === val.name)
            state.tabsList.splice(res, 1)      
        },
        setMenu(state, val) {
            state.menu = val
            localStorage.setItem('menu', JSON.stringify(val))
          },
        addMenu(state, router) {
            if (!localStorage.getItem('menu')) {
                return
            }
            const menu = JSON.parse(localStorage.getItem('menu'))        
            state.menu = menu
        
            const menuArray = []
            menu.forEach(item => {
                if (item.children.length > 0 ) {
                    item.children = item.children.map(item => {
                        item.component = module[`../views/${item.url}.vue`]
                        if (item.children === null) {
                            delete item.children
                            delete item.type
                        }
                        return item
                    })                
                    menuArray.push(...item.children)
                }
                else {
                    if (item.children.length ===0 || item.children ===null ) {
                        delete item.children
                        delete item.type
                    }
                    item.component = module[`../views/${item.url}.vue`]
                    menuArray.push(item)
                }
            })
        
            menuArray.forEach(item => {
                router.addRoute('home1', item)
            })
        },
        cleanMenu(state) {
            state.menu = []
            localStorage.removeItem('menu')
        },
        setToken(state, val) {
            state.token = val
            Cookie.set('token', val)
        },
        clearToken(state) {
            state.token = ''
            Cookie.remove('token')
        },
        getToken(state) {
            state.token = state.token || Cookie.get('token')
        },
        setUsername(state, username) {
            state.username = username
            localStorage.setItem('username', JSON.stringify(username))          
        },
        setUserid(state, user_id) {
            state.user_id = user_id
            localStorage.setItem('user_id', JSON.stringify(user_id))            
        },
        getUsername(state, username) {
            if (!localStorage.getItem('username')) {
                return
            }
            // const username = JSON.parse(localStorage.getItem('username'))        
            state.username = JSON.parse(localStorage.getItem('username'))        
        },
        getUserid(state, user_id) {
            if (!localStorage.getItem('user_id')) {
                return
            }
            // const username = JSON.parse(localStorage.getItem('username'))        
            state.username = JSON.parse(localStorage.getItem('user_id'))        
        },
        cleanUsername(state) {
            state.menu = []
            localStorage.removeItem('username')
        },
        cleanUserid(state) {
            state.menu = []
            localStorage.removeItem('user_id')
        },
    }
})