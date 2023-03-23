import AxiosInstance from '@/plugin/axios'
import { Module } from 'vuex'

const msgModule: Module<any, any> = {
  namespaced: true,
  state: {
    currentUserData: null,
    currentUserMsg: [],
    allRooms: []
  },
  getters: {
    isCurrentRoom: (state) => (_id) => {
      return state.currentUserData?._id === _id
    }
  },
  mutations: {
    setRooms (state, payload):void {
      state.allRooms = payload
    },
    newUserConnect (state, payload): void {
      payload.hasNewMessages = false
      const userExist = state.allRooms.find(item => item.email === payload.email)
      if (!userExist) {
        state.allRooms.push(payload)
      } else {
        state.allRooms.forEach(item => {
          if (item.email === payload.email) {
            item.isOnline = 1
          }
        })
      }
    },

    setUserIsOnline (state, payload): void {
      state.allRooms.forEach((user) => {
        console.log(payload)
        if (user.userName === payload.userName) {
          user.isOnline = false
        }
      })
    },
    setCurrentUserData (state, payload) {
      state.currentUserData = payload
    },
    setCurrentUserMsg (state, payload: IMessage[]) {
      state.currentUserMsg = payload
    },
    addCurrentUserMsg (state, payload): void {
      state.currentUserMsg.push(payload)
    }
  },
  actions: {
    async addMsg ({ commit }, payload) {
      const result = await AxiosInstance.post('/addMsg', payload)
      if (!result.data) return
      commit('addCurrentUserMsg', result.data)
    }
  },
  modules: {
  }
}

export default msgModule
