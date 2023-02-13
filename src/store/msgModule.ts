
import socket from '@/utilities/socketConnection'
import { Module } from 'vuex'

const msgModule: Module<any, any> = {
  state: {
    // 目前聊天視窗都是1對1 =>之後可能增加群組聊天 =>建立roomID 和 userId
    // 假設自己的USERID 898989
    currentUserId: '56002',
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
    isCurrentRoom: (state) => (id) => {
      return state.currentUserId === id
    },
    currentUserData: (state) => {
      return state.allRooms.filter(item => item.userId === state.currentUserId)[0]
    },
    // currentChatDetails: (state, getters) => {
    //   return getters.currentRoomData.msg
    // },
    // 訊息數量
    currentChatDetailsLength: (state, getters) => {
      console.log(getters.currentUserData?.msg)
      return getters.currentUserData?.msg.length > 0
    }
  },
  mutations: {
    getAllRooms (state, payload):void {
      state.allRooms = payload
      state.allRooms.forEach((user) => {
        user.self = user.userId === socket.id
        if (user.self) {
          user.connected = true
        }
      })
    },
    pushRooms (state, payload):void {
      for (let i = 0; i < state.allRooms.length; i++) {
        const existingUser = state.allRooms[i]
        if (existingUser.userId === payload.userId) {
          existingUser.connected = true
          return
        }
      }
      payload.hasNewMessages = false
      state.allRooms.push(payload)
    },
    changeUser (state, payload):void {
      state.currentUserId = payload
    },
    addMessage (state, payload):void {
      socket.emit('privateMessage', {
        content: payload,
        to: state.currentUserId
      })
      const idx = state.allRooms.findIndex(item => item.userId === state.currentUserId)
      state.allRooms[idx].msg.push({ content: payload, fromSelf: true })
    },
    changeOnline (state, payload) {
      console.log(payload)
      state.allRooms.forEach((user) => {
        if (user.userId === payload) {
          user.connected = false
        }
      })
    }
  },
  actions: {
  },
  modules: {
  }
}

export default msgModule
