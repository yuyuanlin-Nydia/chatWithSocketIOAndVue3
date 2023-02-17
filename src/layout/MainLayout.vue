<template>
  <div class="mainPage">
    <MenuBar />
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import MenuBar from '@/components/MenuBar.vue'
</script>
<style lang="scss">
.mainPage{
  display: flex;
  height: 100%;
  width: 100%;
}
</style>
