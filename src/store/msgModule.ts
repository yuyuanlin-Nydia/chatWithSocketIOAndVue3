
import socket from '@/utilities/socketConnection'
import { Module } from 'vuex'

const msgModule: Module<any, any> = {
  namespaced: true,
  state: {
    // 目前聊天視窗都是1對1 =>之後可能增加群組聊天 =>建立roomID 和 userId
    // 假設自己的USERID 898989
    currentUserData: null,
    allRooms: [
      //  TODO:timeReceived要改成秒數 並由近到遠排序
      //  TODO:msg比較長 會有...結尾
      // {
      //   userId: '56001',
      //   useName: 'Rosa'
      //   // isOnline: true,
      //   // msg: [
      //   //   { userId: 898989, msg: 'Hi~~', unread: true },
      //   //   { userId: 10001, msg: 'I wanna ask', unread: null },
      //   //   { userId: 10001, msg: 'Sure!No problem', unread: null }
      //   // ],
      //   // msgUnRead: 5,
      //   // timeReceived: '1min'
      // },
      // {
      //   userId: '56002',
      //   useName: 'Flex'
      //   // isOnline: true,
      //   // msg: [
      //   //   { userId: 898989, msg: 'Hi~~2', unread: true },
      //   //   { userId: 10001, msg: '2I wanna ask', unread: null },
      //   //   { userId: 10001, msg: '2Sure!No problem', unread: null }
      //   // ],
      //   // msgUnRead: 0,
      //   // timeReceived: '5min'
      // },
      // {
      //   userId: '56003',
      //   useName: 'Nydia'
      //   // isOnline: false,
      //   // msg: [
      //   //   { userId: 898989, msg: '3Hi~~', unread: true },
      //   //   { userId: 10001, msg: '3I wanna ask', unread: null },
      //   //   { userId: 10001, msg: '3Sure!No problem', unread: null }
      //   // ],
      //   // msgUnRead: 0,
      //   // timeReceived: '10min'
      // }
    ]
  },
  getters: {
    isCurrentRoom: (state) => (_id) => {
      return state.currentUserData?._id === _id
    },
    currentUserData: (state) => {
      return state.allRooms.filter(item => item._id === state.currentUserData?._id)[0]
    },
    // currentChatDetails: (state, getters) => {
    //   return getters.currentRoomData.msg
    // },
    // 訊息數量
    currentChatDetailsLength: (state, getters) => {
      // return getters.currentUserData?.msg.length > 0
      return true
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
    addMessage (state, payload): void {
      socket.emit('privateMessage', {
        content: payload,
        to: state.currentUserId
      })
      const idx = state.allRooms.findIndex(item => item.userId === state.currentUserId)
      state.allRooms[idx].msg.push({ content: payload, fromSelf: true })
    },
    setUserIsOnline (state, payload) {
      state.allRooms.forEach((user) => {
        if (user.userName === payload.userName) {
          user.isOnline = false
        }
      })
    },
    setCurrentUser (state, payload) {
      state.currentUserData = payload
    }
  },
  actions: {
  },
  modules: {
  }
}

export default msgModule
