<template>
  <div id="app">
    <Breaddit msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import Breaddit from "./components/Breaddit.vue";

export default {
  name: "App",
  components: {
    Breaddit
  }
};
</script>

<style lang="scss">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: url(../public/breadditbackground.jpg);
  min-height: 100%;
  height: auto;
}
</style>
