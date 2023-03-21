<template>
  <div>
    <h3>Release</h3>
    <div class="row">
      <div class="col-md-4 text-center">
        <img
          class="release-image"
          :src="order.order_data.public_art_work_url"
          alt="order image"
          loading="lazy"
        >
      </div>
      <div class="col-md-8">
        <p>
          <strong>Title:</strong> {{ order.order_data.release_title }}
          <br>
          <strong>Primary Artist:</strong>
          <span v-if="order.order_data.primary_artist && order.order_data.primary_artist.artist_name">&nbsp;{{ order.order_data.primary_artist.artist_name }}</span>
          <span v-else-if="order.order_data.primary_artist">&nbsp;{{ order.order_data.primary_artist }}</span>
          <br>
          <strong>Genre:</strong> {{ order.order_data.genre }}
          <br>
          <strong>Status:</strong> {{ order.order_data.status }}
        </p>
        <p><strong>Tracks:</strong></p>
        <ul>
          <li
            v-for="track in order.order_data.tracks"
            :key="track.id"
          >
            {{ track.track_title }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    order: Object
  }
}
</script>

<style lang="scss" scoped>
.release-image {
  max-width: 100%;
  max-height: 125px;
}

hr {
  margin: .5rem 0;
}

p {
  margin-bottom: 0;
}
</style>
