<template>
  <div
    v-if="room"
    class="eachBox"
    :class="[isCurrentUser && !isTopPanel? 'borderLeft': '']"
    @click="changeRoomHandler(room)"
  >
    <div class="imgAndText">
      <div class="imgBox">
        <img
          src="https://picsum.photos/45/45"
          alt=""
        >
        <span
          v-if="room.isOnline"
          class="onlineCircle"
        />
      </div>
      <div class="textMain">
        <div>
          {{ room.userName }} <br>
        </div>
        <p class="latestMsg">
          <!-- TODO:這邊上線給0或1要建enum；不是單純三元運算子=>改成computed -->
          <span v-if="isTopPanel">{{ room.isOnline? 'ONLINE':'OFFLINE' }}</span>
          <span v-else-if="room.latestMsg"> {{ room.latestMsg.msg }}</span>
          <span v-else>Now!You can send messages!!</span>
        </p>
      </div>
    </div>
    <!-- TODO:改成slot -->
    <slot name="rightCon">
      <div class="timeAndMsgNo">
        <div class="text-secondary-grey text-right">
          {{ getLatestMsgFromNow(room.latestMsg?.sendAt) }}
        </div>
        <span
          :style="{
            visibility:room.unReadMsgAmount? 'visible': 'hidden'}"
          class="MsgNo"
        >{{ room.unReadMsgAmount }}</span>
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import socket from '@/utilities/socketConnection'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { dayjsTz, sortString } from '@/utilities/helper'
import { getUserID } from '@/utilities/localStorage'

const props = defineProps({
  room: { type: Object, required: true, default: () => ({}) },
  isTopPanel: { type: Boolean, required: false, default: false }
})

const store = useStore()
const isCurrentUser = computed(() => store.getters['roomModule/isCurrentRoom'](props.room._id))
function changeRoomHandler (roomData) {
  store.commit('roomModule/setCurrentRoomUser', roomData)
  const sortedIds = sortString(roomData._id, getUserID() as string)
  const roomID = sortedIds.join('-')
  socket.emit('changeRoom', roomID)
}
function getLatestMsgFromNow (time: string) {
  return time
    ? dayjsTz(time).fromNow().replace('ago', '')
    : null
}
</script>

<style lang="scss" >
.eachBox{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem;
  border-left: 5px transparent solid;
  background-color: white;
  cursor: pointer;
  border-radius: 5px;
  margin: 15px 0;
  .imgAndText{
    display: flex;
    align-items: center;
    .imgBox{
      position: relative;
      margin-right: 4%;
      img{
        border-radius: 50%;
      }
      .onlineCircle{
        position: absolute;
        bottom: 0;
        right: 0;
        width: 15px;
        height: 15px;
        display: block;
        background-color: rgb(25, 252, 9);
        border-radius: 50%;
      }
    }
    .latestMsg{
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      color:$text-secondary-grey;
      margin: 0;
      width: 80px;
    }

    .textMain{
       flex: 0 65%;
       display: flex;
       flex-direction: column;
       justify-content: space-between;
    }

  }
  .timeAndMsgNo{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    .MsgNo{
      width: 22px;
      height: 22px;
      background-color:$bg-secondary ;
      color: #FCFBFC;
      border-radius: 50%;
      display: grid;
      place-content: center center ;
    }
  }
}
.borderLeft{
  border-left: 5px $bg-secondary solid;
}
</style>
