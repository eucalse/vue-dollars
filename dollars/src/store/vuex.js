import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    username: ''
  },
  mutations: {
    userLogin: function (state, username) {
      state.username = username
    }
  }
})

export default store
