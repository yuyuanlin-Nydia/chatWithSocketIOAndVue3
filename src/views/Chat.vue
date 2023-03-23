<template>
  <div class="chat">
    <ChatRoom />
    <ChatDetail ref="chatDetailRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import ChatRoom from '@/components/ChatRoom.vue'
import ChatDetail from '@/layout/ChatDetail.vue'
import socket from '@/utilities/socketConnection'
import { useStore } from 'vuex'
import { getToken } from '@/utilities/localStorage'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const store = useStore()
const msgState = store.state.msgModule
const currentUserId = computed(() => msgState.currentUserId)
const allRooms = computed(() => msgState.allRooms)
const chatDetailRef = ref()
const testMsg = ref('')
socket.connect()
socket.on('connect', () => {
  const token = getToken()
  if (token) {
    socket.emit('authenticate', { token }, (response) => {
      if (!response.success) {
        store.dispatch('appModule/logout')
      }
    })
  }
  socket.on('userWithNewestMsg', ({ userWithNewestMsg }) => {
    store.commit('msgModule/setRooms', userWithNewestMsg)
    store.commit('msgModule/setCurrentUserData', userWithNewestMsg[0])
  })
  socket.on('currentUserMsg', (currentUserMsg) => {
    store.commit('msgModule/setCurrentUserMsg', currentUserMsg)
    if (chatDetailRef.value) {
      chatDetailRef.value.scrollToBtm()
    }
  })
  socket.on('newUserConnect', (newUser) => {
    $q.notify({
      message: newUser.userName + ' enters chat room!',
      type: 'positive'
    })
    store.commit('msgModule/newUserConnect', newUser)
  })
  socket.on('updateMembers', (msg) => {
    testMsg.value = `這個${msg}`
    allRooms.value[0].clients = msg
  })

  socket.on('newMsgToClient', ({ content, from, to }) => {
    for (let i = 0; i < allRooms.value.length; i++) {
      const user = allRooms.value[i]
      const fromSelf = socket.id === from
      console.log('fromSelf:' + fromSelf)
      if (user.userId === (fromSelf ? to : from)) {
        user.msg.push({
          content,
          fromSelf
        })
        if (user.userId !== currentUserId.value) {
          user.hasNewMessages = true
        }
        break
      }
    }
  })
  socket.on('userDisconnect', (userData) => {
    $q.notify({
      message: userData.userName + ' leaves chat room!',
      type: 'negative'
    })
    store.commit('msgModule/setUserIsOnline', userData)
  })
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
