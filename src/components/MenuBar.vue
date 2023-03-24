<template>
  <ul class="menuBar">
    <li class="bar">
      <q-btn
        dense
        flat
        icon="fa-solid fa-bars"
        size="sm"
        color="white"
      />
    </li>
    <li>
      <q-tooltip
        anchor="bottom end"
        self="bottom left"
        class="bg-amber text-black shadow-4"
      >
        Chat
      </q-tooltip>
      <q-btn
        to="/chat"
        flat
        icon="fa-regular fa-comment"
        size="sm"
        color="white"
        dense
      />
    </li>
    <li>
      <q-tooltip
        anchor="bottom end"
        self="bottom left"
        class="bg-amber text-black shadow-4"
      >
        Setting
      </q-tooltip>
      <q-btn
        to="/setting"
        dense
        flat
        icon="fa-solid fa-gear"
        size="sm"
        color="white"
      />
    </li>
    <li>
      <q-tooltip
        anchor="bottom end"
        self="bottom left"
        class="bg-amber text-black shadow-4"
      >
        Logout
      </q-tooltip>
      <q-btn
        dense
        flat
        icon="fa-solid fa-right-from-bracket"
        size="sm"
        color="white"
        @click="logout"
      />
    </li>
  </ul>
</template>
<script lang="ts" setup>
import { store } from '@/store'
import { getToken } from '@/utilities/localStorage'

function logout () {
  store.dispatch('appModule/logout', {
    user: { token: getToken() }
  })
}

</script>

<style lang="scss">
.menuBar{
  background-color: #4546A5;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 0;
  list-style: none;
  li{
    margin: 50% 0;
    &:hover{
      transform: scale(1.4);
    }
  }
  .bar{
    margin-bottom: 5rem;
  }
}
</style>
