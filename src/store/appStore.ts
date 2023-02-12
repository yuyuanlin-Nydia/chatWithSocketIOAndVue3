
import socket from '@/utilities/socketConnection'

const store = {
  state: {
    isLogIn: false,
    errMsg: ''
  },
  mutations: {
    logIn (state, payload):void {
      socket.auth = payload
      socket.connect()
      socket.on('connect_error', (err) => {
        console.log(err)
      })
      socket.emit('logInFromClient', payload)
    },
    getLogInStat (state, payload) :void {
      state.isLogIn = payload
      state.errMsg = payload ? '' : 'No account found'
    }
  },
  actions: {

  }

}

export default store
