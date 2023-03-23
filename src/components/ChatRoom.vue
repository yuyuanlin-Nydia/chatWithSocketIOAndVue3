<template>
  <div class="chatRoom">
    <h5><b>CHAT</b></h5>
    <!-- TODO:搜尋功能 -->
    <q-input
      v-model="filterText"
      outlined
      placeholder="Search"
      dense
      color="grey"
    >
      <template #prepend>
        <q-icon
          name="fa-solid fa-magnifying-glass"
          size="sm"
        />
      </template>
    </q-input>
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

<script lang="ts" setup>
import { computed, ref } from 'vue'
import CharacterBox from '@/components/CharacterBox.vue'
import { useStore } from 'vuex'

const store = useStore()
const filterText = ref<string>('')
const allRooms = computed(function () {
  return store.state.msgModule.allRooms
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
