<template>
  <div
    class="eachBox"
    :class="[isCurrentUser && !isTopPanel? 'borderLeft': '']"
    @click="changeRoomHandler(room.userId)"
  >
    <div class="imgAndText">
      <div class="imgBox">
        <img
          src="https://picsum.photos/45/45"
          alt=""
        >
        <span
          v-if="room?.connected"
          class="onlineCircle"
        />
      </div>
      <div class="textMain">
        <div>
          {{ room?.userName }} <br>
        </div>
        <p
          class="newestText"
        >
          <!-- TODO:這邊上線給0或1要建enum；不是單純三元運算子=>改成computed -->
          <!-- {{ isTopPanel? room.connected:room.msg[0]?.msg }} -->
          <span v-if="isTopPanel">{{ room?.connected? 'ONLINE':'OFFLINE' }}</span>
          <span v-else-if="!room?.msg?.length"> Now!You can send messages!!</span>
          <span v-else>{{ room?.msg[room.msg.length-1].content }}</span>
        </p>
      </div>
    </div>
    <!-- TODO:改成slot -->
    <slot name="rightCon">
      <div class="timeAndMsgNo">
        <div class="text-secondary-grey">
          10min
        </div>
        <span
          v-show="room?.hasNewMessages"
          class="MsgNo"
        >{{ room?.hasNewMessages }}</span>
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import { useStore } from 'vuex'

export default defineComponent({
  name: 'CharacterBox',
  props: {
    room: { type: Object, required: true },
    isTopPanel: { type: Boolean, required: false, default: false }
  },
  setup (props) {
    const store = useStore()
    const isCurrentUser = computed(() => store.getters.isCurrentRoom(props.room?.userId))

    return {
      changeRoomHandler: (userId) => store.commit('changeUser', userId),
      isCurrentUser
    }
  }
})

</script>

<style lang="scss" >
.eachBox{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem;
  background-color: #FCFBFC;
  border-left: 5px transparent solid;
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
    .newestText{
     display: -webkit-box;
     -webkit-line-clamp: 2;
     -webkit-box-orient: vertical;
     overflow: hidden;
     color:$text-secondary-grey;
    }

    .textMain{
       flex: 0 65%;
    }

  }
  .timeAndMsgNo{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    .MsgNo{
      width: 30px;
      height: 30px;
      background-color:$bg-secondary ;
      color: #FCFBFC;
      border-radius: 50%;
      padding: 5%;
      display: grid;
      place-content: center center ;
    }
  }
}
.borderLeft{
  border-left: 5px $bg-secondary solid;
 }
</style>
