<template>
  <div style="width: 100%;">
    <div
      v-if="currentRoomUser"
      class="chatDetail"
      @click="onChatDetailClick"
      @contextmenu="onChatDetailClick"
    >
      <div class="topPanel">
        <CharacterBox
          :room="currentRoomUser"
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
        <template v-if="currentRoomMsg && currentRoomMsg.length">
          <q-list
            v-show="isOptionsShow"
            ref="optionsRef"
            v-click-outside="onClickOptionsOutside"
            bordered
            separator
            dense
            class="hiddenOptions"
            :style="optionsListPosition"
          >
            <q-item
              v-ripple
              clickable
              dense
              @click="handleCopy"
            >
              <q-item-section avatar>
                <q-icon name="fa-solid fa-copy" />
              </q-item-section>
              <q-item-section>
                COPY
              </q-item-section>
            </q-item>
            <q-item
              v-if="currentMsgData && currentMsgData.from !==currentRoomUser._id "
              v-ripple
              clickable
              dense
              @click="handleUnsendMsg"
            >
              <q-item-section avatar>
                <q-icon name="fa-solid fa-trash" />
              </q-item-section>
              <q-item-section>
                UNSEND
              </q-item-section>
            </q-item>
          </q-list>
          <div
            v-for="(aMsg, index) in currentRoomMsg"
            :key="index"
            :class="['eachMsgBox', aMsg.from !== currentRoomUser._id ? 'myMsg':'notMyMsg']"
          >
            <img
              src="https://picsum.photos/30/30"
              alt=""
              style="border-radius:50%"
            >
            <div class="dataDisplay">
              <span
                v-if="!aMsg.isUnsend"
                class="aMsgDetail"
              >
                {{ aMsg.isRead && aMsg.from !== currentRoomUser._id ? "Read" : null }} <br>
                {{ dayjsTz(aMsg.sendAt).format('YYYY-MM-DD HH:mm') }}
              </span>
              <span
                :class="['msgText', aMsg.isUnsend ? 'unsendMsg':'']"
                @contextmenu="showOptions($event, aMsg)"
              >
                {{ aMsg.isUnsend? 'This msg has been unsent.' : aMsg.msg }}
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
      <div class="msgInputBox">
        <input
          ref="inputMsgRef"
          v-model="inputMsg"
          class="input"
          type="text"
          placeholder="write your message..."
          @keyup.enter="inputMsg? msgSubmitHandler():null"
          @focus="isFocus = true"
          @blur="isFocus = false"
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
    <div
      v-else
      class="flex items-center justify-center emptyBg"
    >
      <h6>
        Please select chat room!
      </h6>
    </div>
  </div>
</template>

<script lang="ts" setup>
import CharacterBox from '@/components/CharacterBox.vue'
import { computed, ref, nextTick, defineExpose, watch } from 'vue'
import { dayjsTz, sortString } from '@/utilities/helper'
import { useStore } from 'vuex'
import { getUserID } from '@/utilities/localStorage'
import socket from '@/utilities/socketConnection'
import { QList, useQuasar } from 'quasar'

const inputMsg = ref<string>('')
const inputMsgRef = ref<HTMLInputElement | null>(null)
const store = useStore()
const currentRoomUser = computed(() => store.state.roomModule.currentRoomUser)
const currentRoomMsg = computed(() => store.state.roomModule.currentRoomMsg)
const msgBoxRef = ref<HTMLDivElement>()
const isFocus = ref<boolean>(false)
const optionsRef = ref<QList | null>(null)
const defaultOptionsListPosition: Record<string, string> = {
  top: '0px',
  left: '0px'
}
const optionsListPosition = ref<Record<string, string>>({ ...defaultOptionsListPosition })
const isOptionsShow = ref<boolean>(false)
const currentMsgData = ref<IMessage | null>(null)
const $q = useQuasar()

watch(currentRoomUser, async () => {
  await nextTick()
  if (inputMsgRef.value) {
    inputMsgRef.value.focus()
  }
})

defineExpose({
  scrollToBtm,
  isFocus
})

function scrollToBtm () {
  nextTick(() => {
    if (msgBoxRef.value) {
      msgBoxRef.value.scrollTop = msgBoxRef.value.scrollHeight
    }
  })
}

async function msgSubmitHandler () {
  const sortedIds = sortString(currentRoomUser.value._id, getUserID() as string)
  const roomID = sortedIds.join('-')
  const msgData = {
    roomID,
    msg: inputMsg.value,
    to: currentRoomUser.value._id,
    from: getUserID() as string,
    sendAt: Date.now
  }
  socket.emit('privateMessage', msgData)
  inputMsg.value = ''
}

async function showOptions (event, msgData) {
  event.preventDefault()
  event.stopPropagation()
  if (msgData.isUnsend) return
  currentMsgData.value = msgData
  isOptionsShow.value = true
  await nextTick()
  calculateOptionsPosition(event)
}

function calculateOptionsPosition (event) {
  const optionsRefWidth = optionsRef.value?.$el.clientWidth
  const optionsRefHeight = optionsRef.value?.$el.clientHeight
  var leftValue = (document.body.clientWidth - event.clientX < optionsRefWidth)
    ? event.clientX - optionsRefWidth
    : event.clientX
  var topValue = (event.clientY > (msgBoxRef.value!.clientHeight / 2))
    ? event.pageY - optionsRefHeight - 10
    : event.pageY + 10
  optionsListPosition.value = {
    left: leftValue + 'px',
    top: topValue + 'px'
  }
}

function hideShowedOptions () {
  isOptionsShow.value = false
}

function onClickOptionsOutside () {
  hideShowedOptions()
}

function onChatDetailClick (event) {
  if (event.target.classList.contains('msgText') && isOptionsShow.value) {
    hideShowedOptions()
  }
}

function handleUnsendMsg () {
  isOptionsShow.value = false
  socket.emit('unsendMsg', currentMsgData.value!._id)
}

function handleCopy () {
  isOptionsShow.value = false
  navigator.clipboard.writeText(currentMsgData.value!.msg)
    .then(() => {
      $q.notify({
        message: 'Copy successfully!',
        type: 'positive'
      })
    })
}

socket.on('unsendMsgSuccess', (msgID) => {
  store.commit('roomModule/unsendMsg', msgID)
})
</script>

<style lang="scss">
.chatDetail{
  display: flex;
  flex-direction: column;
  padding:0 10px;
  width: 100%;
  height: 100%;
  background-color: $bg-lightGrey;
  .topPanel{
    height: 100px;
  }
  .msgBox{
    margin-top: 15px;
    padding:0 10px;
    height: calc(100% - 180px);
    overflow-y: auto;
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
  }
}
.msgText{
  padding: 7px 10px;
}
.myMsg,.notMyMsg{
  .unsendMsg{
  background-color: transparent;
  color: $text-secondary-grey;
  border:1px solid $text-secondary-grey
  }
}
.aMsgDetail{
  text-align: right;
  line-height: 1rem;
  color: $darkGrey;
  font-size: 0.7rem;
  color: $text-secondary-grey;
}
.notMyMsg{
  flex-direction: row;
  .msgText{
    background-color: white;
    border-radius: 12px 12px 12px 0px;
  }
  .dataDisplay{
    flex-direction: row-reverse;
  }
}
.msgInputBox{
 border-top: 1px solid lightgray;
 padding: 2% 0;
 display: flex;
 align-items: center;
 justify-content: space-between;
 input{
    width: 93%;
 }
}
.emptyBg{
  height: 100%;
  width: 100%;
  background-color: $bg-lightGrey;
}
.hiddenOptions{
  position: absolute;
  z-index: 100;
  background-color: white;
  height: fit-content;
  width: fit-content;
}

</style>
