<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card>
      <v-card-title>
        <h2 class="m-0">Order</h2>
        <v-spacer></v-spacer>
        <v-icon @click="openModal">mdi-close</v-icon>
      </v-card-title>
      <v-card-subtitle>
        Order ID: {{ selectedUuid }}
      </v-card-subtitle>
      <v-card-text>
        <div
          v-if="loading"
          class="loading"
        />
        <div v-else-if="order">
          <order-detail :order="order" />
          <hr>
          <curator
            v-if="order.type === 'curator'"
            :order="order"
          />
          <release
            v-if="order.type === 'distribution'"
            :order="order"
          />
          <GWU
            v-if="order.type === 'gwu'"
            :order="order"
          />
          <PressRelease
            v-if="order.type === 'press-release'"
            :order="order"
          />
          <MiniProfile
            v-if="order.type === 'mini-profile'"
            :order="order"
          />
          <InstagramPlacement
            v-if="order.type === 'instagram-placement'"
            :order="order"
          />
          <AudioEngineerOrder
            @updated="getProductOrder"
            @loading="(isLoading) => loading = isLoading"
            v-if="order.type === 'audio-engineering-service'"
            :order="order"
          />
          <SoundStoreOrder
            v-if="order.type === 'sound-store'"
            :order="order"
          />
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'
import OrderDetail from '@/components/Orders/Modals/OrderDetail'
import Curator from '@/components/Orders/Modals/Curator'
import Release from '@/components/Orders/Modals/Release'
import GWU from '@/components/Orders/Modals/GWU'
import PressRelease from '@/components/Orders/Modals/PressRelease'
import MiniProfile from '@/components/Orders/Modals/MiniProfile'
import InstagramPlacement from '@/components/Orders/Modals/InstagramPlacement'
import AudioEngineerOrder from '@/components/Orders/Modals/AudioEngineerOrder'
import SoundStoreOrder from '@/components/Orders/Modals/SoundStoreOrder'

export default {
  components: {
    OrderDetail,
    Curator,
    Release,
    GWU,
    PressRelease,
    MiniProfile,
    InstagramPlacement,
    AudioEngineerOrder,
    SoundStoreOrder
  },
  props: {
    selectedUuid: String
  },
  data: function () {
    return {
      dialog: false,
      order: null,
      loading: false
    }
  },
  methods: {
    getProductOrder: async function () {
      try {
        this.loading = true
        let { data: { data } } = await Vue.$http.get(`v1/order/${this.selectedUuid}`)
        this.order = data
      } catch (err) {
        this.$sentry.captureException(err)
        console.log(err)
      }
      this.loading = false
    },
    openModal () {
      this.dialog = !this.dialog
      if (this.dialog) {
        this.$nextTick(() => {
          this.getProductOrder()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  box-shadow: none;
  border: none;

  .card-body {
    padding: 0 1.25rem 1.25rem;
  }
}

hr {
  margin: .5rem 0;
}
</style>
