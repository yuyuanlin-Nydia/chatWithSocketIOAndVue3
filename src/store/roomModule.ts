import { Module } from 'vuex'

const roomModule: Module<any, any> = {
  namespaced: true,
  state: {
    allRooms: [],
    currentRoomUser: null,
    currentRoomMsg: []
  },
  getters: {
    isCurrentRoom: (state) => (_id) => {
      return state.currentRoomUser?._id === _id
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
    setRoomIsOnline (state, payload): void {
      state.allRooms.forEach((user) => {
        if (user.userName === payload.userName) {
          user.isOnline = false
        }
      })
    },
    setCurrentRoomUser (state, payload): void {
      state.currentRoomUser = payload
    },
    setCurrentRoomMsg (state, payload: IMessage[]): void {
      state.currentRoomMsg = payload
    },
    addCurrentRoomMsg (state, payload): void {
      state.currentRoomMsg.push(payload)
    },
    updateRoomWithLatestMsg (state, payload): void {
      console.log(state.currentRoomUser)
      state.allRooms.forEach((item) => {
        if (item._id === state.currentRoomUser._id) {
          item.latestMsgArr[0] = payload
        }
      })
    }
  },
  actions: {
  },
  modules: {
  }
}

export default roomModule
