<template>
  <div class="chat">
    <ChatRoom />
    <ChatDetail />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, inject } from 'vue'
import ChatRoom from '@/components/ChatRoom.vue'
import ChatDetail from '@/layout/ChatDetail.vue'
import socket from '@/utilities/socketConnection'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
const $q = useQuasar()
const store = useStore()
const msgState = store.state.msgModule
const currentUserId = computed(() => msgState.currentUserId)
const allRooms = computed(() => msgState.allRooms)

const testMsg = ref('')
onMounted(() => {
  socket.connect()
  socket.on('connect', () => {
    console.log(socket.id)
  })
  socket.emit('chatPageEnter', 'test')
  socket.on('allUsers', (users) => {
    const newUserList = users.filter((user) => {
      return user.userId !== socket.id
    })
    store.commit('msgModule/setRooms', newUserList)
    store.commit('msgModule/setCurrentUser', newUserList[0])
  })
  socket.on('newUserConnect', (newUser) => {
    $q.notify({
      message: newUser.userName + '已進入聊天室',
      type: 'positive'
    })
    store.commit('newUserConnect', newUser)
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
      message: userData.userName + '已離開聊天室',
      type: 'negative'
    })
    store.commit('setUserIsOnline', userData)
  })
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
