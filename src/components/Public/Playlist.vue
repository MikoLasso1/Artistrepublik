<template>
  <div class="playlist-container">
    <v-checkbox
      class="playlist-checkbox"
      v-if="!viewOnly"
      v-model="selected"
      type="checkbox"
      @change="selectedChange"
    >
    </v-checkbox>
    <v-card class="playlist" max-width="430">
      <a class="playlist-image-link" :href="playlist.url" target="_blank">
        <img class="playlist-image" :src="playlist.image_url" alt="playlist image" loading="lazy">
      </a>
      <div class="playlist-info">
        <p class="playlist-text">
          <span class="playlist-title">Playlist:</span> {{ playlist.name }}
          <v-avatar
            slot="icon"
            size="25"
            v-if="playlist.is_subscribed"
          >
            <img src="/img/curator/curator_check_mark.png" alt="disc in sleeve" loading="lazy" />
          </v-avatar>
        </p>
        <p class="playlist-text"><span class="playlist-title">Genre:</span> {{ playlist.genres.map(g => g.name).join(', ') }}</p>
      </div>
      <div class="playlist-stats">
        <p class="playlist-text"><span class="playlist-title">Followers:</span> {{ formatNumber(playlist.followers) }}</p>
        <p class="playlist-text"><span class="playlist-title">Placement:</span> {{ formatPercentage(playlist.placement) }}%</p>
      </div>
      <div class="playlist-choice">
        <p class="playlist-price">{{ playlist.price | centsToDollar }}</p>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    selectedIds: Array,
    playlist: Object,
    viewOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      listSelected: null
    }
  },
  computed: {
    selected () {
      return this.selectedIds.includes(this.playlist.id)
    }
  },
  methods: {
    selectedChange: function () {
      this.$emit('toggle-selected', this.playlist.id)
    },
    formatPrice (value) {
      let val = (value / 1).toFixed(2).replace('.', '.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    formatPercentage (value) {
      let val = parseFloat(value).toFixed(1)
      return val
    },
    formatNumber (value) {
      return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  flex: 0 1 calc(100% - 27px);
  max-width: calc(100% - 27px) !important;
  @media screen and (min-width: 360px) {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: min-content min-content;
    min-height: 250px;
  }

  &-container {
    flex: 1 1 100%;
    margin: 5px auto 40px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    max-width: 250px;
    @media screen and (min-width: 360px) {
      max-width: calc(100% - 20px);
    }
    @media screen and (min-width: 800px) {
      flex: 0 1 50%;
      padding: 0 10px;
    }
    @media screen and (min-width: 992px) {
      flex: 0 1 30%;
    }
    @media screen and (min-width: 2160px) {
      flex: 0 1 25%;
    }
    @media screen and (min-width: 2360px) {
      flex: 0 1 20%;
    }
  }

  &-container input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    display: inline-block;
    position: relative;
    background-color: #ede2f0;
    color: #fff;
    top: 0;
    height: 20px;
    width: 20px;
    border: 0;
    border-radius: 0.25rem;
    cursor: pointer;
    margin-right: 7px;
    margin-top: 5px;
    outline: none;
    flex: 0 1 27px;
    @media screen and (min-width: 360px) {
      flex: 0 1 auto;
    }
  }

  input[type="checkbox"]:checked::before {
    position: absolute;
    font: 13px/1 "Open Sans", sans-serif;
    left: 6px;
    top: 3px;
    content: "\02143";
    transform: rotate(40deg);
  }

  input[type="checkbox"]:hover,
  input[type="checkbox"]:checked {
    background-color: #dbcfdf;
  }

  &-image-link {
    align-self: top;
  }

  &-image {
    width: 100%;
    padding: .25rem;
    background-color: #f8f9fe;
    border: 1px solid #dee2e6;
    border-radius: .375rem;
    -webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, .075);
    box-shadow: 0 1px 2px rgba(0, 0, 0, .075);
    @media screen and (min-width: 992px) {
      max-width: 150px;
      max-height: 150px;
      width: auto;
      height: auto;
    }
  }

  &-info {
    padding: 10px;
  }

  &-stats {
    padding: 10px;
  }

  &-text,
  &-title {
    margin-bottom: 10px;
    font-size: 14px;
  }

  &-title {
    color: #8898aa;
  }

  &-choice {
    align-self: end;
    padding: 10px;
    text-align: right;
  }

  &-price {
    margin: 0;
    font-size: 34px;
  }
}
</style>
