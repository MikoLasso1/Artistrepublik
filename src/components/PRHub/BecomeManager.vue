<template>
  <div>
    <v-card class="pressrelease-card" v-if="fromHub === 0">
      <v-card-title>
        <h2 class="pressrelease-heading">Blog Promotion Manager</h2>
      </v-card-title>
      <v-card-subtitle>
        Promote Artist Content
      </v-card-subtitle>
      <v-card-actions class="justify-center">
        <picture>
          <source srcset="/img/blog-promotion/blog-promotion_sm.webp" type="image/webp">
          <img src="/img/blog-promotion/blog-promotion_sm.png" alt="blog" loading="lazy" />
        </picture>
      </v-card-actions>
      <v-card-text class="text-center">
        <h3 class="pressrelease-description-heading">Become a Outlet Manager!</h3>
        <p class="pressrelease-description">List your blog, connect with artists and grow your news network.</p>
        <v-btn
          @click="showBecomeManagerModal"
          color="success"
        >
          List Your Outlet
        </v-btn>
      </v-card-text>
    </v-card>
    <div v-else>
      <v-btn dark @click="showBecomeManagerModal" color="primary" class="mt-2">
        <span>Edit / Add Outlets</span>
      </v-btn>
    </div>
    <BecomeManagerModal ref="BecomeManagerModal" />
  </div>
</template>

<script>
import BecomeManagerModal from '@/components/PRHub/BecomeManagerModal'

export default {
  components: {
    BecomeManagerModal
  },
  props: {
    fromHub: {
      type: [Number, Boolean],
      default: 0
    }
  },
  methods: {
    showBecomeManagerModal () {
      this.$refs.BecomeManagerModal.openModal()
    }
  }
}
</script>

<style>

</style>
