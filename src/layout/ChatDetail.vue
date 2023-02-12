<template>
  <div class="chatDetail">
    <CharacterBox
      :room="currentUserData"
      :is-top-panel="true"
    >
      <template #rightCon>
        <div>123456</div>
      </template>
    </CharacterBox>
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
    <TextInput />
  </div>
</template>

<script lang="ts">
import CharacterBox from '@/components/CharacterBox.vue'
import TextInput from '@/components/form/TextInput.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
  name: 'ChatDetail',
  components: { CharacterBox, TextInput },
  setup () {
    const store = useStore()
    const currentUserData = computed(() => store.getters.currentUserData)
    const currentChatDetailsLength = computed(() => store.getters.currentChatDetailsLength)
    return {
      currentUserData,
      currentChatDetailsLength
    }
  }
}
</script>

<style lang="scss">
.chatDetail{
  flex:0 70%;
  position: relative;
  .msgBox{
    height: 73vh;
    overflow-y: auto ;
    background-color: $bg-lightGrey;
    padding: 0.8rem;

  }
  .eachMsgBox{
    display: flex;
    align-items: center;
    gap:1%;
    margin: 3% 0;
    >span{
      padding: 12px ;
      width: 60%;
    }
    >img{
      align-self: flex-end;
    }
  }
}
.noMsgTxt{
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.myMsg{
  flex-direction: row-reverse;
  >span{
    border-radius: 12px 12px 0 12px;
    color: white;
    background-color: $bg-primary-blue;
  }
}
.notMyMsg{
  flex-direction: row;
  >span{
    background-color: white;
    border-radius: 12px 12px 12px 0px;
  }
}
</style>
