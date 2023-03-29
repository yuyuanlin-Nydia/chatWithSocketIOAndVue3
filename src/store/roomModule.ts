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
      const [filteredRoom] = state.allRooms.filter((item) => { return item._id === payload.from || item._id === payload.to })
      const index = state.allRooms.findIndex((item) => { return item._id === payload.from || item._id === payload.to })
      filteredRoom.latestMsg = payload
      state.allRooms.splice(index, 1)
      state.allRooms.unshift(filteredRoom)
    },
    updateRoomWithUnreadAmount (state, payload) {
      state.allRooms.forEach((item) => {
        if (item._id === payload.from) {
          item.unReadMsgAmount += 1
        }
      })
    },
    updateRoomWithRead (state) {
      state.allRooms.forEach((item) => {
        if (item._id === state.currentRoomUser._id) {
          item.unReadMsgAmount = 0
        }
      })
    },
    updateAllMsgWithRead (state) {
      state.currentRoomMsg = state.currentRoomMsg.map((item) => {
        return {
          ...item,
          isRead: true
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
