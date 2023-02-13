
import socket from '@/utilities/socketConnection'
import { Module } from 'vuex'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { useFirebase } from '@/composable/useFirebase'

const appModule: Module<any, any> = {
  state: {
    isLogIn: false,
    errMsg: ''
  },
  mutations: {
    logIn (state, payload:boolean):void {
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
      state.errMsg = payload ? '' : 'No account found'
    }
  },
  actions: {
    async signIn ({ commit }, payload) {
      const { userName, userPassword } = payload
      const { postApi } = useFirebase()
      const auth = getAuth()
      const result = await postApi(createUserWithEmailAndPassword, auth, userName, userPassword)
      console.log(result)
      // return result
    },
    async logIn ({ commit }, payload) {
      const { userName, userPassword } = payload
      const auth = getAuth()
      const { postApi } = useFirebase()
      const data = await postApi(signInWithEmailAndPassword, auth, userName, userPassword)
      const isAuth = !!data.user
      commit('logIn', isAuth)
    }
  }

}

export default appModule
