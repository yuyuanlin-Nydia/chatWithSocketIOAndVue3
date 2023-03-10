<template>
  <div id="main">
    <div class="view">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import socket from '@/utilities/socketConnection'

socket.on('connect_error', (err) => {
  console.log(err.message)
  setTimeout(() => {
    socket.connect()
  }, 1000)
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
