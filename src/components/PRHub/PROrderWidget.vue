<template>
  <v-card class="pressrelease-card card">
    <v-card-title>
      <h2 class="pressrelease-heading">Blog Promotion</h2>
    </v-card-title>
    <v-card-subtitle>
      Grow Your Brand and Name Recognition
    </v-card-subtitle>
    <v-card-actions class="justify-center pressrelease-card-actions">
      <picture>
        <source srcset="/img/blog-promotion/blog-promotion_sm.webp" type="image/webp">
        <img src="/img/blog-promotion/blog-promotion_sm.png" alt="blog" loading="lazy" />
      </picture>
    </v-card-actions>
    <v-card-text class="text-center">
      <h3 class="pressrelease-description-heading">Create a Post and Distribute Your Article!</h3>
      <p class="pressrelease-description">Distribute news about your career to one blog or to dozens across the globe.</p>
      <v-btn
        @click="showOrderModal"
        color="success"
      >
        Distribute Press Release
      </v-btn>
    </v-card-text>
    <PROrderModal ref="PROrderModal" />
  </v-card>
</template>
<script>
import PROrderModal from '@/components/PRHub/PROrderModal'

export default {
  components: {
    PROrderModal
  },
  methods: {
    showOrderModal () {
      this.$refs.PROrderModal.openModal()
    }
  }
}
</script>
<style>
.pressrelease-card {
  height: 100%;
}

.pressrelease-heading {
  margin: 0;
}

.pressrelease-description-heading {
  font-family: "Montserrat-SemiBold", sans-serif;
  font-size: 1.25rem;
}

.pressrelease-description {
  text-transform: uppercase;
  font-family: "Montserrat-Light", sans-serif;
  font-size: 0.9rem;
}

.pressrelease-card-actions {
  min-height: 123px;
}
</style>
