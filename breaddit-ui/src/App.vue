<template>
  <div id="app">
    <Breaddit />
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
  color: #2c3e50;
  background-image: url(../public/breadditbackground.jpg);
  min-height: 100%;
  height: auto;
}

ul {
  margin: 0px;
}
</style>
