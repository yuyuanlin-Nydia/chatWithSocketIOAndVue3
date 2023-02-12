<template>
  <div id="main">
    <MenuBar v-if="isLogIn" />
    <div class="view">
      <!-- <router-link to="/">Chat</router-link> |
      <router-link to="/Setting">Setting</router-link> -->
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import MenuBar from '@/components/MenuBar.vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'App',
  components: {
    MenuBar
  },
  setup () {
    const store = useStore()
    return {
      isLogIn: computed(() => store.state.appStore.isLogIn)
    }
  }

})
</script>

<style lang="scss">
body{
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

#main {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

#main a {
  font-weight: bold;
  color: #2c3e50;

}

#nav a.router-link-exact-active {
  color: #42b983;
}

.view{
  width: 100%;
  height: 100%;
}
</style>
