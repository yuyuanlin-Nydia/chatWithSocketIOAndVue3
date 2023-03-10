import { Module } from 'vuex'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useHttp } from '@/composable/useHttp'
import { getToken, setToken, clearToken } from '@/util/localStorage'
import router from '@/router'
import { Notify } from 'quasar'
import AxiosInstance from '@/plugin/axios'
import socket from '@/utilities/socketConnection'

const appModule: Module<any, any> = {
  namespaced: true,
  state: {
    isLogin: false,
    userAccount: ''
  },
  mutations: {
    setUserData (state, payload) {
      state.isLogin = true
      state.userData = payload.user
      setToken(payload.token)
      router.push({ name: 'Chat' })
      socket.connect()
    },
    setLogOut (state): void{
      state.isLogin = false
      clearToken()
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
    async signUp ({ commit }, payload) {
      const { userName, userPassword } = payload
      const { postApi } = useHttp()
      const auth = getAuth()
      await postApi(createUserWithEmailAndPassword, auth, userName, userPassword)
    },
    async login ({ commit }, payload) {
      const result = await AxiosInstance.post('/login', {
        email: payload.userName,
        password: payload.userPassword
      })
      commit('setUserData', result.data)
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
