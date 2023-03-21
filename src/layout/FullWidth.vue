<template>
  <v-container fluid no-gutters class="p-0">
    <main>
      <fade-transition
        :duration="200"
        origin="center top"
        mode="out-in"
      >
        <router-view />
      </fade-transition>
    </main>
  </v-container>
</template>

<script>
import { FadeTransition } from 'vue2-transitions'

export default {
  components: {
    FadeTransition
  }
}
</script>

<style>
.container--fluid {
  max-width: 100% !important;
}
</style>
