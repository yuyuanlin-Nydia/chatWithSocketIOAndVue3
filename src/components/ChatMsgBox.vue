<template>
  <div class="msgBox">
    <template v-if="currentUserData?.msg?.length>0">
      <div
        v-for="(eachMsg,index) in currentUserData.msg"
        :key="index"
        :class="['eachMsgBox',eachMsg.fromSelf?'myMsg':'notMyMsg']"
      >
        <img
          src="https://picsum.photos/30/30"
          alt=""
          style="border-radius:50%"
        >
        <span>{{ eachMsg.content }}</span>
      </div>
    </template>
    <template v-else>
      <div :class="!currentChatDetailsLength? 'noMsgTxt':''">
        <p> There is no messages yet!</p>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const currentUserData = computed(() => store.getters['msgModule/currentUserData'])
const currentChatDetailsLength = computed(() => store.getters['msgModule/currentChatDetailsLength'])
</script>
