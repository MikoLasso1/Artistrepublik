<template>
  <v-card>
    <v-tabs v-model="tab">
      <v-tab>Pending</v-tab>
      <v-tab>Approved</v-tab>
      <v-tab>Denied</v-tab>
      <v-tab>Published</v-tab>
    </v-tabs>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="data"
        :loading="loading"
        :expanded.sync="expanded"
        show-expand
      >
        <template v-slot:item.created_at="{ item }">
          {{ item.created_at | formatDateTime }}
        </template>
        <template v-slot:item.amount="{ item }">
          {{ item.amount | centsToDollar }}
        </template>
        <template v-slot:item.instagram_placement.instagram_handle="{ item }">
          <a :href="`https://instagram.com/${item.instagram_placement.instagram_handle}`" target="_blank">@{{ item.instagram_placement.instagram_handle }}</a>
        </template>
        <template v-slot:item.status="{ item }">
          <v-select
            v-if="tab === 0 || tab === 1"
            v-model="item.status"
            :items="statusOptions"
            @change="onStatusChange(item)"
          ></v-select>
          <span v-else>{{ uppercase(item.status) }}</span>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="pa-4">
            <v-row>
              <v-col md="4">
                <h2 class="h2">Buyer</h2>
                <img
                  v-if="item.instagram_placement.user.profile_photo" :src="item.instagram_placement.user.profile_photo" width="100" style="border-radius: 50%" class="mb-4"
                  :alt="item.instagram_placement.user.name" loading="lazy"
                />
                <p class="body-1">
                  <strong>Name:</strong> {{ item.instagram_placement.user.name }}
                  <br />
                  <strong>Username:</strong>&nbsp;<router-link :to="{path: `/${item.instagram_placement.user.username}`}">{{ item.instagram_placement.user.username }}</router-link>
                  <br />
                  <strong>Instagram Handle:</strong>&nbsp;<a :href="`https://instagram.com/${item.instagram_placement.instagram_handle}`">@{{ item.instagram_placement.instagram_handle }}</a>
                </p>
              </v-col>
              <v-col md="4">
                <h2 class="h2">Placement</h2>
                <p class="body-1">
                  <strong>Genre:</strong> {{ item.instagram_placement.genre }}
                  <br />
                  <strong>Location:</strong> {{ item.instagram_placement.location }}
                  <br />
                  <strong>Post Type:</strong> {{ uppercase(item.instagram_placement.post_type) }}
                  <br />
                  <strong>Swipe Up?</strong> {{ item.instagram_placement.swipe_up ? 'Yes' : 'No' }}
                  <br />
                  <strong>Media:</strong>&nbsp;<a :href="item.instagram_placement.media_url" target="_blank">Download</a>
                  <br />
                  <strong>Caption:</strong> {{ item.instagram_placement.caption }}
                </p>
              </v-col>
              <v-col md="4">
                <h2 class="h2">Actions</h2>
                <v-select
                  v-model="item.status"
                  :items="statusOptions"
                  @change="onStatusChange(item)"
                  label="Status"
                ></v-select>
                <v-btn color="primary" @click="onUpdateLink(item)">Update Link</v-btn>
              </v-col>
            </v-row>
          </td>
        </template>
      </v-data-table>
    </v-card-text>
    <update-link-modal :order="selectedOrder" ref="updateLinkModal" />
    <decline-modal :order="selectedOrder" ref="declineModal" />
  </v-card>
</template>

<script>
import Vue from 'vue'
import UpdateLinkModal from '@/components/InstagramPlacement/UpdateLinkModal'
import DeclineModal from '@/components/InstagramPlacement/DeclineModal'

export default {
  components: {
    UpdateLinkModal,
    DeclineModal
  },
  data: function () {
    return {
      statusOptions: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Denied', value: 'denied' },
        { text: 'Published', value: 'published' }
      ],
      tab: null,
      loading: false,
      expanded: [],
      headers: [
        { text: 'Ordered On', value: 'created_at' },
        { text: 'Type', value: 'type' },
        { text: 'Amount', value: 'amount' },
        { text: 'IG Handle', value: 'instagram_placement.instagram_handle' },
        { text: 'Status', value: 'status' },
        { text: '', value: 'data-table-expand' }
      ],
      data: [],
      selectedOrder: null
    }
  },
  computed: {
    tabStatus: function () {
      switch (this.tab) {
        case 0:
          return 'pending'
        case 1:
          return 'approved'
        case 2:
          return 'denied'
        case 3:
          return 'published'
      }
      return ''
    }
  },
  watch: {
    tab: function () {
      this.data = []
      this.fetchData()
    }
  },
  methods: {
    fetchData: async function () {
      this.loading = true
      try {
        let { data: { data } } = await Vue.$http.get(`v1/instagram-placement/order?status=${this.tabStatus}`)
        this.data = data
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    },
    onStatusChange: async function (order) {
      if (order.status === 'denied') {
        this.selectedOrder = order
        this.$refs.declineModal.openModal()
        return
      }
      let data = { status: order.status }
      try {
        await Vue.$http.put(`v1/instagram-placement/order/${order.id}`, data)
        this.$noty.success('Status updated successfully')
        if (order.status === 'published') {
          this.selectedOrder = order
          this.$refs.updateLinkModal.openModal()
        }
      } catch (err) {
        this.throwError(err)
      }
    },
    onUpdateLink: function (order) {
      this.selectedOrder = order
      this.$refs.updateLinkModal.openModal()
    }
  },
  mounted: function () {
    this.fetchData()
  }
}
</script>

<style>

</style>
