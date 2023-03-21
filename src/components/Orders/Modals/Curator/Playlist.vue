<template>
  <div>
    <div class="playlist row">
      <div class="col-md-2">
        <a :href="playlist.url" target="_blank">
          <img
            :src="playlist.image_url"
            class="img-thumbnail"
            loading="lazy"
            :alt="playlist.name"
          />
        </a>
      </div>
      <div class="col-md-7">
        <div>
          <p class="mb-0"><span>Playlist Name:</span> {{ playlist.name }}</p>
          <p class="mb-0"><span>Genre:</span> {{ genres }}</p>
          <p class="mb-0"><span>Followers:</span> {{ playlist.followers }}</p>
          <div v-if="curatorOrder">
            <p class="mb-0"><span>Status:</span> {{ uppercase(curatorOrder.status) }}</p>
            <p class="mb-0" v-if="curatorOrder.feedback">
              <span>Feedback:</span>
              <read-more
                class="read-more"
                more-str="read more"
                :text="curatorOrder.feedback"
                less-str="read less"
                :max-chars="100"
              />
            </p>
            <p v-else><span>Feedback:</span> No Feedback Yet</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="price">
          <span>{{ playlist.price | centsToDollar }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playlist: Object,
    curatorOrder: Object,
  },
  computed: {
    genres: function () {
      let genres = this.playlist.genres.reduce((accum, val) => {
        accum += val.name + ', '
        return accum
      }, '')
      genres = genres.substr(0, genres.length - 2)
      return genres
    },
  },
  methods: {
    formatPrice: function (value) {
      let val = (value / 1).toFixed(2).replace('.', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
  },
}
</script>

<style lang="scss" scoped>
.playlist {
  display: flex;
  align-items: center;
  padding: 15px 0;

  img {
    width: 100px;
    margin: 0 15px;

    &.small {
      margin: 0 15px 0 0;
      width: 50px;
    }
  }

  .info {
    p {
      > span {
        color: #8898aa;
      }

      margin-bottom: 0;
      font-size: 14px;
    }

    &.small > p {
      font-size: 10px;
    }
  }

  .price {
    flex-grow: 1;
    text-align: right;
    font-size: 26px;

    &.small {
      font-size: 16px;
    }
  }
}
</style>

<style>
.read-more p{
  margin-bottom: 0 !important;
}
</style>
