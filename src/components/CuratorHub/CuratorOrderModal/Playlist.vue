<template>
  <div>
    <div class="playlist row">
      <div class="col-1">
        <input
          v-if="!viewOnly"
          v-model="selected"
          type="checkbox"
          @change="selectedChange"
        >
      </div>
      <div class="col-10 col-lg-2">
        <a
          :href="playlist.url"
          target="_blank"
        ><img
          :alt="playlist.name"
          :class="{small: viewOnly}"
          :src="playlist.image_url"
          class="img-thumbnail"
          loading="lazy"
        ></a>
      </div>
      <div class="col-lg-5">
        <div
          class="playlist-info"
          :class="{small: viewOnly}"
        >
          <p class="mb-0">
            <span>Playlist Name:</span> {{ playlist.name }}
            <v-avatar
              slot="icon"
              size="25"
              v-if="playlist.is_subscribed"
            >
              <img class="unset-width" src="/img/curator/curator_check_mark.png" alt="curator check mark" loading="lazy" />
            </v-avatar>
          </p>
          <p class="mb-0"><span>Genre:</span> {{ playlist.genres.map(g => g.name).join(', ') }}</p>
          <p class="mb-0"><span>Followers:</span> {{ formatNumber(playlist.followers) }}</p>
          <p class="mb-0"><span>Placement:</span> {{ playlist.placement === 100 ? 'N/A' : `${formatPercentage(playlist.placement)}%` }}</p>
        </div>
      </div>
      <div class="col-lg-3">
        <div
          class="price"
          :class="{small: viewOnly}"
        >
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
    isSelected: Boolean,
    viewOnly: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      selected: this.isSelected
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
  display: flex;
  padding: 15px 0;
  border-top: 1px solid #e9ecef;

  input[type="checkbox"] {
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
    outline: none;
  }

  input[type="checkbox"]:checked::before {
    position: absolute;
    font: 13px/1 "Open Sans", sans-serif;
    left: 6px;
    top: 3px;
    content: "\02143";
    transform: rotate(40deg);
  }

  input[type="checkbox"]:hover {
    background-color: #dbcfdf;
  }

  input[type="checkbox"]:checked {
    background-color: #473C85;
  }

  img {
    width: 100px;

    &.small {
      margin: 0 15px 0 0;
      width: 50px;
    }
  }

  .playlist-info {
    padding: 10px 0;
    @media screen and (min-width: 992px) {
      padding: 0;
    }

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
    padding: 0 15px;

    &.small {
      font-size: 16px;
    }
  }
}

.unset-width {
  width: unset !important;
}
</style>
