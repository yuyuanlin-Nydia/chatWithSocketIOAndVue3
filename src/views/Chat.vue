<template>
  <div class="chat">
    <ChatRoom />
    <ChatDetail />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import ChatRoom from '@/components/ChatRoom.vue' // @ is an alias to /src
import ChatDetail from '@/layout/ChatDetail.vue' // @ is an alias to /src
import socket from '@/utilities/socketConnection'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Chat',
  components: {
    ChatRoom, ChatDetail
  },
  setup () {
    const store = useStore()
    const msgState = store.state.msgStore
    const currentUserId = computed(() => msgState.currentUserId)
    const allRooms = computed(() => msgState.allRooms)

    const inMsg = ref('')
    const testMsg = ref('')
    // 所有使用者 包含自己
    socket.emit('chatPageEnter')
    socket.on('users', (users) => {
      const newUserList = users.filter((user) => {
        return user.userId !== socket.id
      })
      store.commit('getAllRooms', newUserList)
    })

    socket.on('updateMembers', (msg) => {
      testMsg.value = `這個${msg}`
      allRooms.value[0].clients = msg
    })
    socket.on('userConnected', (newUser) => {
      store.commit('pushRooms', newUser)
    })
    socket.on('disconnect', () => {
      console.log('disconnect')
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
    socket.on('userDisconnected', (socketUserID) => {
      store.commit('changeOnline', socketUserID)
    })
    socket.on('disconnect', () => {
      allRooms.value.forEach((user) => {
        if (user.self) {
          user.connected = false
        }
      })
    })

    return {
      inMsg,
      testMsg,
      allRooms
    }
  }
})
</script>

<style lang="scss" scoped>
.chat{
 height: 100%;
 display: flex;
 justify-content: flex-start;

}
</style>
