<template>
  <div class="chatDetail">
    <div class="topPanel">
      <CharacterBox
        :room="currentUserData"
        :is-top-panel="true"
      >
        <template #rightCon>
          <div>
            <q-btn
              flat
              icon="fa-regular fa-star"
              size="sm"
              round
            />
            <q-btn
              flat
              icon="fa-solid fa-info"
              size="sm"
              round
            />
          </div>
        </template>
      </CharacterBox>
    </div>
    <!-- 訊息顯示 -->
    <div
      ref="msgBoxRef"
      class="msgBox"
    >
      <template v-if="currentUserMsg?.length>0">
        <div
          v-for="(aMsg, index) in currentUserMsg"
          :key="index"
          :class="['eachMsgBox', aMsg.from !== currentUserData?._id ? 'myMsg':'notMyMsg']"
        >
          <img
            src="https://picsum.photos/30/30"
            alt=""
            style="border-radius:50%"
          >
          <div class="dataDisplay">
            <span>
              {{ dayjsTz(aMsg.sendAt).format('YYYY-MM-DD hh:mm') }}
            </span>
            <span class="msgText">
              {{ aMsg.msg }}
            </span>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="noMsgTxt">
          <p> There is no messages yet!</p>
        </div>
      </template>
    </div>
    <!-- 下方輸入框 -->
    <div class="searchInput">
      <input
        v-model="inputMsg"
        type="text"
        placeholder="write your message..."
        @keyup.enter="msgSubmitHandler"
      >
      <q-btn
        round
        size="sm"
        icon="fa-solid fa-paper-plane"
        color="orange"
        text-color="black"
        :disabled="!inputMsg"
        @click="msgSubmitHandler"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import '@fortawesome/fontawesome-free/css/all.css'
import CharacterBox from '@/components/CharacterBox.vue'
import { computed, ref, onMounted, nextTick, defineExpose } from 'vue'
import { dayjsTz } from '@/utilities/helper'

import { useStore } from 'vuex'
import { getUserID } from '@/utilities/localStorage'

const inputMsg = ref<string>('')
const store = useStore()
const currentUserData = computed(() => store.state.msgModule.currentUserData)
const currentUserMsg = computed(() => store.state.msgModule.currentUserMsg)
const msgBoxRef = ref<HTMLDivElement>()

defineExpose({
  scrollToBtm
})

function scrollToBtm () {
  nextTick(() => {
    if (msgBoxRef.value) {
      msgBoxRef.value.scrollTop = msgBoxRef.value.scrollHeight
    }
  })
}
async function msgSubmitHandler () {
  await store.dispatch('msgModule/addMsg', {
    msg: inputMsg.value,
    to: currentUserData.value._id,
    from: getUserID() as string,
    sendAt: Date.now
  })
  scrollToBtm()
  inputMsg.value = ''
}
</script>

<style lang="scss">
.chatDetail{
  display: flex;
  flex-direction: column;
  padding:0 10px;
  width: 100%;
  .topPanel{
    height: 100px;
  }
  .msgBox{
    margin-top: 15px;
    padding:0 10px;
    height: calc(100% - 180px);
    overflow-y: auto;
    background-color: #FCFBFC;
  }
}
.noMsgTxt{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.eachMsgBox{
  display: flex;
  align-items: center;
  gap:1%;
  margin: 3% 0;
  .dataDisplay{
    display: flex;
    align-items: flex-end;
    gap: 5px;
  }
  >img{
    align-self: flex-end;
  }
}

.myMsg{
  flex-direction: row-reverse;
  .msgText{
    border-radius: 12px 12px 0 12px;
    color: white;
    background-color: $bg-primary-blue;
    padding: 10px;
  }
}
.notMyMsg{
  flex-direction: row;
  .msgText{
    background-color: white;
    border-radius: 12px 12px 12px 0px;
    padding: 10px;
  }
  .dataDisplay{
    flex-direction: row-reverse;
  }
}
.searchInput{
 border-top: 1px solid lightgray;
 padding: 2% 0;
 display: flex;
 align-items: center;
 justify-content: space-between;

 input{
    width: 93%;
 }
}
</style>
