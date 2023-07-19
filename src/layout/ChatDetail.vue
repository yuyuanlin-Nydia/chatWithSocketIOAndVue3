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
        <template v-if="currentRoomMsg.length">
          <q-btn-dropdown
            v-if="currentRoomBulletin.length"
            icon="fa-solid fa-bullhorn"
            color="primary"
            :label="currentRoomBulletin[0].msg"
            class="bulletin"
          >
            <q-list>
              <div
                v-for="aBulletinMsg in currentRoomBulletin"
                :key="aBulletinMsg._id"
              >
                <q-item
                  v-close-popup
                  clickable
                  @click="scrollToMsg(aBulletinMsg._id)"
                >
                  <q-item-section avatar>
                    <q-icon name="fa-solid fa-bullhorn" />
                  </q-item-section>
                  <div style="width: 100%">
                    <q-item-section>{{ aBulletinMsg.msg }}</q-item-section>
                    <span style="color: grey;">
                      {{ aBulletinMsg.bulletinBy }}
                    </span>
                  </div>
                  <q-btn
                    size="xs"
                    label="Cancel Bulletin"
                    flat
                    color="primary"
                    @click="cancelBulletin(aBulletinMsg._id, $event)"
                  />
                </q-item>
                <q-separator />
              </div>
            </q-list>
          </q-btn-dropdown>
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
            <q-item
              v-ripple
              clickable
              dense
              @click="handleBulletinAdd"
            >
              <q-item-section avatar>
                <q-icon name="fa-solid fa-bullhorn" />
              </q-item-section>
              <q-item-section>
                SET AS BULLETIN
              </q-item-section>
            </q-item>
          </q-list>
          <div
            v-for="(aMsg, index) in currentRoomMsg"
            ref="msgRefs"
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

const store = useStore()
const $q = useQuasar()
const inputMsg = ref<string>('')
const defaultOptionsListPosition: Record<string, string> = {
  top: '0px',
  left: '0px'
}
const optionsListPosition = ref<Record<string, string>>({ ...defaultOptionsListPosition })
const isOptionsShow = ref<boolean>(false)
const currentMsgData = ref<IMessage | null>(null)
const inputMsgRef = ref<HTMLInputElement | null>(null)
const msgBoxRef = ref<HTMLDivElement | null>(null)
const msgRefs = ref<Array<HTMLDivElement | null >>([])
const isFocus = ref<boolean>(false)
const optionsRef = ref<QList | null>(null)
const currentRoomUser = computed(() => store.state.roomModule.currentRoomUser)
const currentRoomMsg = computed(() => store.state.roomModule.currentRoomMsg)
const currentRoomBulletin = computed(() => store.state.roomModule.currentRoomBulletin)

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
    from: getUserID() as string
  }
  socket.emit('privateMessage', msgData)
  inputMsg.value = ''
}

async function showOptions (event: Event, msgData) {
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

socket.on('unsendMsgSuccess', (msgID) => {
  store.commit('roomModule/unsendMsg', msgID)
})

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

function handleBulletinAdd () {
  isOptionsShow.value = false
  if (isDuplicateBulletin()) return
  socket.emit('addBulletin', currentMsgData.value!._id)
  $q.notify({
    message: 'Set as bulletin successfully!',
    type: 'positive'
  })
}

socket.on('addBulletinSuccess', (result: IBulletin) => {
  store.commit('roomModule/addCurrentRoomBulletin', result)
})

function isDuplicateBulletin () {
  const isDuplicate = currentRoomBulletin.value.findIndex(item => item._id === currentMsgData.value!._id) >= 0
  if (isDuplicate) {
    $q.notify({
      message: 'This message has already set as bulletin!',
      type: 'negative'
    })
  }
  return isDuplicate
}

function cancelBulletin (id: string, event: Event) {
  event.stopPropagation()
  socket.emit('cancelBulletin', id)
  $q.notify({
    message: 'Cancel bulletin successfully!',
    type: 'positive'
  })
}

socket.on('cancelBulletinSuccess', (result: string) => {
  store.commit('roomModule/cancelCurrentRoomBulletin', result)
})

function scrollToMsg (bulletinID: string) {
  if (msgBoxRef.value && msgRefs.value) {
    const msgIndex = currentRoomMsg.value.findIndex(item => item._id === bulletinID)
    const elem = msgRefs.value[msgIndex]!
    elem.scrollIntoView({
      block: 'center'
    })
    elem.classList.add('shake')
    elem.addEventListener('animationend', () => {
      elem.classList.remove('shake')
    })
  }
}

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
.bulletin{
  width: 100%;
  position: sticky;
  top: 0;
}
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
