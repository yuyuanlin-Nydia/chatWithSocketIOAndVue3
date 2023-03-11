<template>
  <div class="searchInput">
    <input
      v-model="inputMsg"
      type="text"
      placeholder="write your message..."
      @keyup.enter="msgSubmitHandler"
    >
    <button
      class="submitBtn"
      @click="msgSubmitHandler"
    >
      <font-awesome-icon
        icon="fa-solid fa-paper-plane"
        size="lg"
      />
    </button>
  </div>
</template>

<script lang="ts" >
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'TextInput',
  setup () {
    const inputMsg = ref('')
    const store = useStore()
    const msgSubmitHandler = () => {
      store.commit('addMessage', inputMsg.value)
    }

    return {
      inputMsg,
      msgSubmitHandler
    }
  }
})
</script>

<style lang="scss" scoped>
.searchInput{
 border-top: 1px solid lightgray;
 padding: 2% 0;
 display: flex;
 align-items: center;
 justify-content: space-between;
 input{
    width: 93%;
 }
 .submitBtn{
    background-color: orange;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    border: none;
 }
}
</style>
