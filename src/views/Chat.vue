<template>
  <div class="chat">
    <ChatRoom />
    <ChatDetail
      ref="chatDetailRef"
    />
    <q-inner-loading
      :showing="isLoading"
      style="z-index: 100;"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import ChatRoom from '@/components/ChatRoom.vue'
import ChatDetail from '@/layout/ChatDetail.vue'
import socket from '@/utilities/socketConnection'
import { useStore } from 'vuex'
import { getToken } from '@/utilities/localStorage'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const store = useStore()
const chatDetailRef = ref<typeof ChatDetail | null>(null)
const isLoading = ref<boolean>(true)
const currentRoomUser = computed(() => {
  return store.state.roomModule.currentRoomUser
})

watch(() => chatDetailRef.value?.isFocus, (newVal) => { // 如果輸入框有聚焦 收到的訊息要已讀
  if (newVal && currentRoomUser.value?.unReadMsgAmount) {
    socket.emit('updateMsgWithRead', currentRoomUser.value.latestMsg.roomID)
    store.commit('roomModule/updateRoomWithRead')
  }
})

socket.connect()
socket.on('connect', () => {
  const token = getToken()
  if (token) {
    socket.emit('authenticate', token, (response) => {
      if (!response.success) {
        store.dispatch('appModule/logout')
      }
    })
  }
})

socket.on('userWithNewestMsg', (userWithNewestMsg) => {
  store.commit('roomModule/setRooms', userWithNewestMsg)
  isLoading.value = false
})

socket.on('currentRoomMsg', (currentRoomMsg: IMessage[], currentRoomBulletin: IBulletin[]) => {
  store.commit('roomModule/setCurrentRoomMsg', currentRoomMsg)
  store.commit('roomModule/setCurrentRoomBulletin', currentRoomBulletin)
  if (chatDetailRef.value) {
    chatDetailRef.value.scrollToBtm()
  }
})

socket.on('newUserConnect', (newUser) => {
  $q.notify({
    message: newUser.userName + ' is online now!',
    type: 'positive'
  })
  store.commit('roomModule/newUserConnect', newUser)
})

socket.on('newMsgToClient', (msgData) => { // 聊天室的人收到
  store.commit('roomModule/addCurrentRoomMsg', msgData)
  store.commit('roomModule/updateRoomWithLatestMsg', msgData)
  store.commit('roomModule/updateRoomWithUnreadAmount', { msgData, amount: +1 })
  if (chatDetailRef.value) {
    chatDetailRef.value.scrollToBtm()
  }
})

socket.on('updateRoomWithUnreadAmount', (msgData) => {
  store.commit('roomModule/updateRoomWithUnreadAmount', { msgData, amount: -1 })
})

socket.on('updateMsgWithReadSuccess', () => {
  store.commit('roomModule/updateRoomWithRead')
  store.commit('roomModule/updateAllMsgWithRead')
})
socket.on('userDisconnect', (userData) => {
  $q.notify({
    message: userData.userName + ' is offline now!',
    type: 'negative'
  })
  store.commit('roomModule/setRoomIsOnline', userData)
})

socket.on('connect_error', (err) => {
  if (err.message === 'token error') {
    socket.auth = {
      token: getToken()
    }
    socket.connect()
  }
})

</script>

<style lang="scss" scoped>
.chat{
 height: 100%;
 width: 100%;
 display: flex;
 justify-content: flex-start;

}
</style>
