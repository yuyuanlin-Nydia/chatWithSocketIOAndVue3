<template>
  <div class="chatRoom">
    <h5><b>CHAT</b></h5>
    <q-input
      v-model="filterText"
      outlined
      placeholder="Search user"
      dense
      color="grey"
      style="background-color: white;"
    >
      <template #prepend>
        <q-icon
          name="fa-solid fa-magnifying-glass"
          size="sm"
        />
      </template>
    </q-input>
    <div class="roomBox">
      <template v-if="roomsDisplay.length">
        <CharacterBox
          v-for="perRoom in roomsDisplay"
          :key="perRoom._id"
          :room="perRoom"
          :is-top-panel="false"
        />
      </template>
      <template v-else>
        <div
          class="flex items-center justify-center"
          style="height: 100%;"
        >
          No matched user!
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import CharacterBox from '@/components/CharacterBox.vue'
import { useStore } from 'vuex'

const store = useStore()
const filterText = ref<string>('')
const roomsDisplay = computed(function () {
  return store.state.roomModule.allRooms.filter(aRoom => aRoom.userName.includes(filterText.value))
})

</script>

<style lang="scss">
.chatRoom{
  padding: 1.5%;
  flex: 0 30%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: $bg-lightGrey;
  margin-right: 5px;
  .roomBox{
    overflow-y: auto;
    overflow-x: hidden;
    height: 90%;
  }
}
</style>
