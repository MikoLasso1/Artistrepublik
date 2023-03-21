<template>
  <div>
    <table v-if="orders !== null && orders.length > 0" class="table tablesorter table align-items-center table-flush pr-orders">
      <thead class="thead-light">
      <tr>
        <th scope="col" class="header">Headline</th>
        <th scope="col" class="header text-center">Blog</th>
        <th scope="col" class="header text-center">Publication Link</th>
      </tr>
      </thead>
      <tbody class="list">
      <tr
        class="row-contact"
        v-for="order in orders"
        :key="order.id"
      >
        <td>
          <p>{{ ((order.press_release || {}).headline || '') }}</p>
        </td>
        <td
          class="text-center"
          v-if="(order.press_release || false)"
        >
          <PROrderDetailsModal :pressReleaseData="order.press_release" />
        </td>
        <td class="text-center">
          <PRTableOrderStatus
            :order-id="order.id"
            :selectedValue="order.status"
            :order-link="order.link"
            @update:link="showPRLinkModal"
          ></PRTableOrderStatus>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-else class="pressrelease-orders-none">
      <h3 class="pressrelease-orders-none-title">You have no orders.</h3>
      <picture>
        <source srcset="/img/brand/logo_dark_xs.webp" type="image/webp">
        <img class="pressrelease-orders-none-image" src="/img/brand/logo_dark_xs.png" alt="Artist Republik Logo" loading="lazy" />
      </picture>
    </div>
    <PROrderLinkModal ref="PROrderLinkModal" :order-id="orderId" :publication-link="publicationLink" />
  </div>
</template>

<script scoped>
import Vue from 'vue'
import PRTableOrderStatus from '@/components/PRHub/PRTable/PRTableOrderStatus'
import PROrderDetailsModal from '@/components/PRHub/PRTable/PROrderDetailsModal'
import PROrderLinkModal from '@/components/PRHub/PRTable/PROrderLinkModal'

export default {
  props: {
    ordersData: String
  },
  components: {
    PRTableOrderStatus,
    PROrderDetailsModal,
    PROrderLinkModal
  },
  data () {
    return {
      orders: null,
      selectedPRID: null,
      publicationLink: null,
      orderId: null
    }
  },
  methods: {
    formatPrice: function (value) {
      let val = (value / 1).toFixed(2).replace('.', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    showPRLinkModal (orderId, publicationLink) {
      console.log(orderId, publicationLink)
      this.orderId = orderId
      this.publicationLink = publicationLink
      this.$refs.PROrderLinkModal.openModal()
    }
  },
  created () {
    Vue.$http
      .get(`v1/press-release/order?status=${this.ordersData}`)
      .then(response => {
        this.orders = response.data.data
      })
      .catch(error => {
        console.log(error)
      })
  },
  mounted: function () {
    if (this.$route.query.order_uuid) {
      // this.showPRModal(this.$route.query.order_uuid);
    }
  }
}
</script>
<style scoped>
table td {
  white-space: break-spaces;
}

.pressrelease-orders-none {
  padding: 3rem 0;
  text-align: center;
}

.pressrelease-orders-none-title {
  text-transform: uppercase;
  font-weight: 300;
}

.pressrelease-orders-none-image {
  opacity: 0.5;
  max-width: 100px;
}

@media only screen and (max-width: 1274px),
(min-device-width: 768px) and (max-device-width: 1280px) {
  .pr-orders table,
  .pr-orders thead,
  .pr-orders tbody,
  .pr-orders th,
  .pr-orders td,
  .pr-orders tr {
    display: block;
  }

  .pr-orders thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .pr-orders tr {
    border: 1px solid #121d3b;
  }

  .pr-orders td {
    border: none;
    position: relative;
    padding-left: 50%;
    padding-top: 5px;
  }

  .pr-orders td:before {
    position: absolute;
    top: 0;
    left: 6px;
    width: 45%;
    white-space: nowrap;
    padding: 1rem 5px;
    font-weight: 900;
  }

  .pr-orders td:nth-of-type(1):before {
    content: "Headline";
  }

  .pr-orders td:nth-of-type(2):before {
    content: "Blog";
  }

  .pr-orders td:nth-of-type(3):before {
    content: "Link";
  }
}
</style>
