import Vue from 'vue'
import Router from 'vue-router'
import loginPage from '../components/loginPage'
import chatting from '../components/chatting'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: loginPage,
    name: 'loginPage'
  },
  {
    path: '/chatting',
    component: chatting,
    name: 'chatting'
  }
  ]
})
