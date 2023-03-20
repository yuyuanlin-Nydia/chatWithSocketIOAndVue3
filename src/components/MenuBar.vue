<template>
  <ul class="menuBar">
    <li class="icon bar">
      <font-awesome-icon
        icon="fa-solid fa-bars"
        inverse
        size="lg"
      />
    </li>
    <router-link to="/chat">
      <li class="icon">
        <font-awesome-icon
          icon="fa-regular fa-comment"
          class=""
          inverse
          size="lg"
        />
      </li>
    </router-link>
    <router-link to="/setting">
      <li class="icon">
        <font-awesome-icon
          icon="fa-solid fa-gear"
          class=""
          inverse
          size="lg"
        />
      </li>
    </router-link>
    <li
      class="icon bar"
      @click="logout"
    >
      <font-awesome-icon
        icon="fa-solid fa-right-from-bracket"
        inverse
        size="lg"
      />
    </li>
  </ul>
</template>
<script lang="ts" setup>
import { store } from '@/store'

function logout () {
  store.dispatch('appModule/logout')
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
