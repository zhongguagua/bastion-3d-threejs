<template>
  <div id="app">
    <SpaceGame />
  </div>
</template>

<script>
import SpaceGame from './components/SpaceGame.vue'

export default {
  name: 'App',
  components: {
    SpaceGame
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
}

#app {
  width: 100%;
  height: 100%;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
