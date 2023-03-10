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
    <ChatMsgBox />
    <TextInput />
  </div>
</template>

<script lang="ts" setup>
import CharacterBox from '@/components/CharacterBox.vue'
import TextInput from '@/components/form/TextInput.vue'
import ChatMsgBox from '@/components/ChatMsgBox.vue'
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()
const currentUserData = computed(() => store.getters['msgModule/currentUserData'])
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
