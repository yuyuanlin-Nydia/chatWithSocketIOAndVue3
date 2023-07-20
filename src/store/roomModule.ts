import { Module } from 'vuex'

const roomModule: Module<any, any> = {
  namespaced: true,
  state: {
    allRooms: [],
    currentRoomUser: null,
    currentRoomMsg: [],
    currentRoomBulletin: []
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
      const isChatRoomUser = payload.from === state.currentRoomUser?._id || payload.to === state.currentRoomUser?._id
      if (!isChatRoomUser) return
      state.currentRoomMsg.push(payload)
    },
    setCurrentRoomBulletin (state, payload: IBulletin[]): void {
      state.currentRoomBulletin = payload
    },
    addCurrentRoomBulletin (state, payload: IBulletin): void {
      state.currentRoomBulletin.unshift(payload)
    },
    cancelCurrentRoomBulletin (state, payload: string): void {
      state.currentRoomBulletin = state.currentRoomBulletin.filter(msg => msg._id !== payload)
    },
    updateRoomWithLatestMsg (state, payload): void {
      state.allRooms.forEach((item) => {
        if (item._id === payload.from || item._id === payload.to) {
          item.latestMsg = payload
        }
      })
      function sortByTime (a, b) {
        const aValue = a.latestMsg?.sendAt || 0
        const bValue = b.latestMsg?.sendAt || 0
        return new Date(bValue).valueOf() - new Date(aValue).valueOf()
      }
      state.allRooms.sort(sortByTime)
    },
    updateRoomWithUnreadAmount (state, payload) {
      state.allRooms.forEach((item) => {
        if (item._id === payload.msgData.from) {
          item.unReadMsgAmount = item.unReadMsgAmount + payload.amount
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
    },
    unsendMsg (state, payload) {
      state.currentRoomMsg.forEach((item) => {
        if (item._id === payload._id) {
          item.isUnsend = true
        }
      })
      // 如果被刪除的是最後一則訊息 左側顯示被刪除訊息的上一則
      if (state.currentRoomMsg[state.currentRoomMsg.length - 1]._id === payload._id) {
        const msgWithoutUnsend = state.currentRoomMsg.filter(msg => !msg.isUnsend)
        state.allRooms.forEach((item) => {
          if (item._id === payload.from || item._id === payload.to) {
            item.latestMsg = msgWithoutUnsend[msgWithoutUnsend.length - 1]
          }
        })
        state.allRooms.sort(sortByTime)
      }

      function sortByTime (a, b) {
        const aValue = a.latestMsg?.sendAt || 0
        const bValue = b.latestMsg?.sendAt || 0
        return new Date(bValue).valueOf() - new Date(aValue).valueOf()
      }
    }
  },
  actions: {
  },
  modules: {
  }
}

export default roomModule
