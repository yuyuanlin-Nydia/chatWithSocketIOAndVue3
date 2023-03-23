import { Module } from 'vuex'
import { getToken, setToken, clearToken, setUserID, clearUserID } from '@/utilities/localStorage'
import router from '@/router'
import { Notify } from 'quasar'
import AxiosInstance from '@/plugin/axios'
import socket from '@/utilities/socketConnection'

const appModule: Module<any, any> = {
  namespaced: true,
  state: {
    isLogin: false,
    userData: ''
  },
  mutations: {
    setUserData (state, payload) {
      state.isLogin = true
      state.userData = payload.user
      setToken(payload.token)
      setUserID(payload.user._id)
      router.push({ name: 'Chat' })
    },
    setLogOut (state): void{
      state.isLogin = false
      clearToken()
      clearUserID()
      socket.disconnect()
      router.push({ name: 'Login' })
      Notify.create({
        message: '您已登出',
        type: 'warning'
      })
    },
    changeLoginSta (state, payload) {
      state.isLogin = payload
    },
    getLogInStat (state, payload) :void {
      state.isLogin = payload
    }
  },
  actions: {
    async signup ({ commit }, payload) {
      const result = await AxiosInstance.post('/signup', payload)
      if (result.data.success) {
        commit('setUserData', result.data)
      } else {
        Notify.create({
          message: result.data.errMsg,
          type: 'negative'
        })
      }
    },
    async login ({ commit }, payload) {
      const result = await AxiosInstance.post('/login', payload)
      if (result.data.success) {
        commit('setUserData', result.data)
      } else {
        Notify.create({
          message: result.data.errMsg,
          type: 'negative'
        })
      }
    },
    async checkAuth ({ commit }) {
      const result = await AxiosInstance.post('/auth')
      commit('changeLoginSta', result.data)
      if (!result.data) {
        router.push({ name: 'Login' })
      }
    },
    async logout ({ commit }) {
      await AxiosInstance.post('/logout', {
        user: { token: getToken() }
      })
      commit('setLogOut')
    }
  }
}

export default appModule
