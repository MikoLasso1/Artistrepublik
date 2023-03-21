<template>
  <table v-if="curatorOrders !== null && curatorOrders.length > 0" class="table tablesorter table align-items-center table-flush curator-orders">
    <thead class="thead-light">
    <tr>
      <th scope="col" class="header">
        Track Name
      </th>
      <th scope="col" class="header">
        Link
      </th>
      <th scope="col" class="header">
        Playlist Name
      </th>
      <th scope="col" class="header">
        Price
      </th>
      <th scope="col" class="header">
        Action
      </th>
    </tr>
    </thead>
    <tbody class="list">
    <tr
      v-for="curatorOrder in curatorOrders"
      :key="curatorOrder.id"
      class="row-contact"
    >
      <td class="content">
        <strong>Track:</strong> {{ curatorOrder.user_track.name }}
      </td>
      <td class="content">
        <a
          :href="curatorOrder.user_track.url"
          target="_blank"
        >
          <v-btn
            type="button"
            small
            dark
            class="rounded-0"
          ><span>Preview Song</span></v-btn>
        </a>
      </td>
      <td class="content">
        {{ curatorOrder.playlist.name }}
      </td>
      <td class="content">
        {{ curatorOrder.playlist_price | centsToDollar }}
      </td>
      <td class="content">
        <div class="row">
          <div class="col-md-4 text-align-right">
            <strong>Step 1:</strong>
          </div>
          <div class="col-md-7">
            <CuratorTableOrderFeedback
              :feedback-message="curatorOrder.feedback"
              :order-id="curatorOrder.uuid"
            />
          </div>
        </div>
        <div class="row pt-2">
          <div class="col-md-4 text-align-right">
            <strong>Step 2:</strong>
          </div>
          <div class="col-md-7">
            <CuratorTableOrderStatus
              :order-id="curatorOrder.uuid"
              :selected-value="curatorOrder.status"
            />
          </div>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
  <div v-else class="curator-orders-none">
    <h3 class="curator-orders-none-title">You have no orders.</h3>
    <picture>
      <source srcset="/img/brand/logo_dark_xs.webp" type="image/webp">
      <img class="curator-orders-none-image" src="/img/brand/logo_dark_xs.png" alt="Artist Republik Logo" loading="lazy" />
    </picture>
  </div>
</template>

<script scoped>
import CuratorTableOrderStatus from '@/components/CuratorHub/CuratorTable/CuratorTableOrderStatus'
import CuratorTableOrderFeedback from '@/components/CuratorHub/CuratorTable/CuratorTableOrderFeedback'

export default {
  components: {
    CuratorTableOrderStatus,
    CuratorTableOrderFeedback
  },
  props: ['curatorOrders'],
  methods: {
    formatPrice (value) {
      let val = (value / 1).toFixed(2).replace('.', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
  }
}

</script>

<style scoped>
table td {
  white-space: break-spaces;
}

.curator-orders-none {
  padding: 3rem 0;
  text-align: center;
}

.curator-orders-none-title {
  text-transform: uppercase;
  font-weight: 300;
}

.curator-orders-none-image {
  opacity: 0.5;
  max-width: 100px;
}

@media screen and (min-width: 1274px) {
  td.content:nth-child(2), td.content:nth-child(3), td.content:nth-child(4) {
    text-align: center;
  }

  th:nth-child(2), th:nth-child(3), th:nth-child(4), th:nth-child(5) {
    text-align: center;
  }

  .text-align-right {
    text-align: right;
  }
}

@media only screen and (max-width: 1274px), (min-device-width: 768px) and (max-device-width: 1280px) {
  .curator-orders table,
  .curator-orders thead,
  .curator-orders tbody,
  .curator-orders th,
  .curator-orders td,
  .curator-orders tr {
    display: block;
  }

  .curator-orders thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  .curator-orders tr {
    border: 1px solid #f1f1f1;
  }

  .curator-orders td {
    border: none;
    position: relative;
    padding-left: 50%;
    padding-top: 5px;
  }

  .curator-orders td:before {
    position: absolute;
    top: 0;
    left: 6px;
    width: 45%;
    white-space: nowrap;
    padding: 1rem 5px;
    font-weight: 900;
  }

  .curator-orders td:nth-of-type(1):before {
    content: "Track Name";
  }

  .curator-orders td:nth-of-type(2):before {
    content: "Link";
  }

  .curator-orders td:nth-of-type(3):before {
    content: "Playlist Name";
  }

  .curator-orders td:nth-of-type(4):before {
    content: "Price";
  }

  .curator-orders td:nth-of-type(4):before {
    content: "Action";
  }
}
</style>
