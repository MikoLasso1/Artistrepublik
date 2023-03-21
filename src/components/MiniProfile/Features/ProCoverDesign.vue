<template>
  <div class="basic-header header align-items-center bg-primary" style="background-image: url('/img/theme/profile-cover.jpg'); background-size: cover; background-position: center top;">
    <div class="container-fluid">
      <div class="header-body">
        <span class="mask  bg-gradient-ar-md opacity-8"></span>
        <div class="container-fluid align-items-center"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ProCoverDesign',
  data () {
    return {}
  }
}
</script>
<style scoped>
.basic-header {
  height: 150px;
}

@media (min-width: 600px) {
  .basic-header {
    height: 269px;
  }
}
</style>
