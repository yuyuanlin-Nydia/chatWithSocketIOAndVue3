import roomModule from '@/store/roomModule'
import appModule from '@/store/appModule'
import { createStore } from 'vuex'

export const store = createStore({
  modules: {
    appModule,
    roomModule
  }
})
