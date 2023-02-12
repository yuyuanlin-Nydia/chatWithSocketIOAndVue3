import msgStore from '@/store/msgStore'
import appStore from '@/store/appStore'

import { createStore } from 'vuex'

const store = createStore({
  modules: {
    msgStore,
    appStore
  }
})

export default store

// import { createStore } from 'vuex'

// export default createStore({
//   state: {
//     allRooms: [
//       { userId: 565656, userName: 'Sandy', msg: 'Hi~~', msgUnRead: 5, timeReceived: '1min' }
//     ],
//     roomA: [
//       { userId: 565656, user: 'Sandy', msg: 'Hi~~' },
//       { userId: 565656, user: 'Sandy', msg: 'I wanna ask' },
//       { userId: 28288, user: 'Bob', msg: 'Sure!No problem' }
//     ]
//   },
//   mutations: {
//     pushRooms (state, payload) {
//       console.log('success')
//       state.allRooms.push(payload)
//     }
//   },
//   actions: {
//   },
//   modules: {
//   }
// })
