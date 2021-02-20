<template>
  <div>
    <div>
      <b-navbar type="dark" variant="dark">
        <b-navbar-brand to="/">
          <img width="40px" height="40px" src="winner.ico" alt="Bread" />
          Breaddit
        </b-navbar-brand>
      </b-navbar>
    </div>
    <b-container fluid="md" class="p-4">
      <!-- Using vue-router -->
      <router-view></router-view>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "Breaddit"
};
</script>