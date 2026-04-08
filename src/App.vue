<template>
  <div id="app">
    <MainNavbar  v-if="!$route.meta.hideNavbar" />
    <router-view />
  </div>
</template>

<script>
import MainNavbar from './components/MainNavbar.vue'

export default {
  name: 'App',
  components: { MainNavbar },
}
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
