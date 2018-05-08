import Vue from 'vue'
import axios from 'axios'

const GITHUB_API_URL = 'https://api.github.com'

export default {
  state: {
    user: undefined
  },
  getters: {
    isAuthenticated: state => {
      return state.user !== undefined
    }
  },
  mutations: {
    updateUser (state, user) {
      if (user) {
        state.user = {
          username: user.login,
          avatar: user.avatar_url
        }
      } else {
        state.user = undefined
      }
    }
  },
  actions: {
    setHeaders () {
      const token = Vue.ls.get('token')
      if (token) {
        axios.defaults.headers.common = {
          Authorization: `token ${token}`
        }
      }
    },
    setToken ({ dispatch, commit }, token) {
      Vue.ls.set('token', token)
      dispatch('setHeaders')
    },
    async login ({ dispatch, state }, token) {
      dispatch('setToken', token)
      await dispatch('fetchUserInfo')
      // console.log('logged in', state.user)
    },
    logout ({dispatch, commit}) {
      commit('updateUser', undefined)
      Vue.ls.set('token', undefined)
      axios.defaults.headers.common = {
      }
    },
    async fetchUserInfo ({ commit }) {
      const { data: user } = await axios.get(`${GITHUB_API_URL}/user`)
      // console.log('Fetch user', user)
      commit('updateUser', user)
    }
  }
}
