<template>
  <div>
    <div class="card shadow">
      <div class="card-header border-0">
        <div class="row align-items-center">
          <div class="col-md-12">
            <h3 class="mb-0">
              Your Curator Orders
            </h3>
          </div>
        </div>
      </div>
      <div class="table-responsive">
        <b-card no-body>
          <b-tabs card>
            <b-tab
              title="Pending"
              active
              @click="tableData('pending')"
            >
              <b-card-text>
                <CuratorTableCard :curator-orders="pendingOrder" />
              </b-card-text>
            </b-tab>
            <b-tab
              title="Archived"
              @click="tableData('archived')"
            >
              <CuratorTableCard :curator-orders="archivedOrder" />
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import CuratorTableCard from '@/components/CuratorHub/CuratorTable/CuratorTableCard'

export default {
  name: 'CuratorTable',
  components: {
    CuratorTableCard
  },
  data () {
    return {
      pendingOrder: null,
      archivedOrder: null,
      url: null
    }
  },
  mounted () {
    this.tableData('pending')
  },
  methods: {
    tableData (orderStatus) {
      Vue.$http
        .get(`v1/service/playlist-republik/curator/order?status=${orderStatus}`)
        .then(response => {
          if (orderStatus === 'pending') {
            this.pendingOrder = response.data.data
          } else {
            this.archivedOrder = response.data.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>
</style>
