<template>
  <div>
    <h3>Track</h3>
    <p>
      <strong>Track Name:</strong> {{ orderData[0].user_track.name }}
      <br />
      <strong>URL:</strong>&nbsp;
      <a :href="orderData[0].user_track.url" target="_blank">
        {{ orderData[0].user_track.url }}
      </a>
      <v-icon
        v-if="within24Hours && orderData[0].status === 'pending'"
        color="primary"
        class="edit"
        @click="$refs.editModal.openModal(orderData[0].user_track)"
      >
        mdi-pencil
      </v-icon>
      <br />
      <strong>Genre:</strong> {{ orderData[0].user_track.genre }}
    </p>
    <hr />
    <h3>Playlists</h3>
    <div class="playlist-wrap">
      <playlist
        v-for="(curatorOrder, i) in orderData"
        :key="i"
        :playlist="curatorOrder.playlist"
        :curator-order="curatorOrder"
      />
    </div>
    <edit-spotify-link ref="editModal" @after-edit="updateOrder" />
  </div>
</template>

<script>
import Vue from 'vue'
import Playlist from '@/components/Orders/Modals/Curator/Playlist'
import EditSpotifyLink from '@/components/Orders/Modals/Curator/EditSpotifyLink'

export default {
  components: {
    Playlist,
    EditSpotifyLink,
  },
  props: {
    order: Object,
  },
  data () {
    return {
      orderData: this.order.order_data,
    }
  },
  computed: {
    within24Hours () {
      let date1 = new Date(this.order.created_at),
        date2 = new Date()

      let diff = Math.abs(date2 - date1) / 36e5

      if (diff < 24) {
        return true
      } else {
        return false
      }
    },
  },
  methods: {
    formatPrice: function (value) {
      let val = (value / 1).toFixed(2).replace('.', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    updateOrder: async function () {
      let {
        data: { data },
      } = await Vue.$http.get(`v1/order/${this.order.uuid}`)
      this.orderData = data.order_data
    },
  },
}
</script>

<style lang="scss" scoped>
hr {
  margin: 0.5rem 0;
}

.edit {
  margin-left: 10px;
}
</style>
