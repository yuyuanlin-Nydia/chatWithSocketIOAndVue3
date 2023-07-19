import { Module } from 'vuex'
import { setToken, clearToken, setUserID, clearUserID } from '@/utilities/localStorage'
import router from '@/router'
import { Notify } from 'quasar'
import { ApiUrl } from '@/enum/apiEnum'
import { PageName } from '@/enum/pageNameEnum'
import { postApi } from '@/plugin/axios'
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
      router.push({ name: PageName.Chat })
    },
    setLogOut (state): void{
      state.isLogin = false
      clearToken()
      clearUserID()
      socket.removeAllListeners()
      socket.disconnect()
      router.push({ name: PageName.Login })
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
      const result = await postApi(ApiUrl.UserSignup, payload)
      if (result) {
        commit('setUserData', result.message)
      }
    },
    async login ({ commit }, payload) {
      const result = await postApi(ApiUrl.UserLogin, payload)
      if (result) {
        commit('setUserData', result.message)
      }
    },
    async checkAuth ({ commit }) {
      const result = await postApi(ApiUrl.UserAuth)
      if (result) {
        commit('changeLoginSta', result.message)
      }
    },
    async logout ({ commit }, payload) {
      const result = await postApi(ApiUrl.UserLogout, payload)
      if (result) {
        commit('setLogOut')
        commit('roomModule/setCurrentRoomUser', null, { root: true })
        commit('roomModule/setRooms', [], { root: true })
      }
    }
  }
}

export default appModule
