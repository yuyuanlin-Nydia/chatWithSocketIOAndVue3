<template>
  <div class="chatDetail">
    <div class="topPanel">
      <CharacterBox
        :room="currentUserData"
        :is-top-panel="true"
      >
        <template #rightCon>
          <div>123456</div>
        </template>
      </CharacterBox>
    </div>
    <div class="msgBox2">
      <ChatMsgBox />
    </div>
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
  display: flex;
  flex-direction: column;
  padding:0 10px;
  width: 100%;
  .topPanel{
    height: 100px;
  }
  .msgBox2{
    margin-top:15px ;
    height: calc(100% - 180px);
    overflow-y: auto ;
    background-color: $bg-lightGrey;
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
