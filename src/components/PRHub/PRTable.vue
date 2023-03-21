<template>
  <div>
    <div class="card">
      <div class="card-header border-0">
        <div class="row align-items-center">
          <div class="col-md-12">
            <h3 class="mb-0">Your Blog Promotion Orders</h3>
          </div>
        </div>
      </div>
      <div class="table-responsive">
        <b-card no-body>
          <b-tabs card lazy>
            <b-tab class="tablist-nav-link" title="Pending" active>
              <b-card-text>
                <PRTableCard orders-data="pending"></PRTableCard>
              </b-card-text>
            </b-tab>
            <b-tab title="Approved">
              <PRTableCard orders-data="approved"></PRTableCard>
            </b-tab>
            <b-tab title="Denied">
              <PRTableCard orders-data="denied"></PRTableCard>
            </b-tab>
            <b-tab title="Published">
              <PRTableCard orders-data="published"></PRTableCard>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import PRTableCard from '@/components/PRHub/PRTable/PRTableCard'

export default {
  components: {
    PRTableCard
  },
  data () {
    return {
      orders: null,
      url: null
    }
  },
  name: 'PRTable'
}
</script>

<style scoped>
</style>
