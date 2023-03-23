<template>
  <div class="chatRoom">
    <h3><b>CHAT</b></h3>
    <!-- TODO:搜尋功能 -->
    <input
      id=""
      type="text"
      placeholder="search"
      name=""
    >
    <div class="roomBox">
      <CharacterBox
        v-for="perRoom in allRooms"
        :key="perRoom._id"
        :room="perRoom"
        :is-top-panel="false"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import CharacterBox from '@/components/CharacterBox.vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ChatRoom',
  components: { CharacterBox },
  setup () {
    const store = useStore()
    const allRooms = computed(function () {
      return store.state.msgModule.allRooms
    })
    return {
      // roomData,
      allRooms
    }
  }
})

</script>

<style lang="scss">
.chatRoom{
  padding: 2%;
  flex: 0 30%;
  height: 95vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .roomBox{
    overflow-y: auto;
    overflow-x: hidden;
    height: 90%;

  }
}
</style>
