
import socket from '@/utilities/socketConnection'
import { Module } from 'vuex'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useHttp } from '@/composable/useHttp'

const appModule: Module<any, any> = {
  state: {
    isLogIn: false
  },
  mutations: {
    logIn (state, payload: boolean):void {
      state.isLogIn = payload
      // socket.auth = payload
      // socket.connect()
      // socket.on('connect_error', (err) => {
      //   console.log(err)
      // })
      // socket.emit('logInFromClient', payload)
    },
    getLogInStat (state, payload) :void {
      state.isLogIn = payload
    }
  },
  actions: {
    async signUp ({ commit }, payload) {
      const { userName, userPassword } = payload
      const { postApi } = useHttp()
      const auth = getAuth()
      await postApi(createUserWithEmailAndPassword, auth, userName, userPassword)
    },
    async logIn ({ commit }, payload) {
      const { userName, userPassword } = payload
      const auth = getAuth()
      const { postApi } = useHttp()
      const data = await postApi(signInWithEmailAndPassword, auth, userName, userPassword)
      const isAuth = !!data.user
      commit('logIn', isAuth)
    }
  }

}

export default appModule
