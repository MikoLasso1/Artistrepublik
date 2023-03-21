<template>
  <v-card class="mx-auto card soundstore-samplecard">
    <v-hover>
      <template v-slot:default="{ hover }">
        <div class="img-wrap">
          <v-img :src="samplePack.img_url" aspect-ratio="1" height="150" cover />
          <v-fade-transition>
            <v-overlay
              v-if="hover"
              absolute
              color="#036358"
            >
              <v-btn
                color="primary"
                :to="`/features/sound-store/sample-pack/${samplePack.uuid}`"
              >
                View Pack
              </v-btn>
            </v-overlay>
          </v-fade-transition>
        </div>
      </template>
    </v-hover>
    <v-card-title>
      <h2 class="font-weight-light text-truncate">
        {{ samplePack.name }}
      </h2>
    </v-card-title>
    <v-card-subtitle>
      <router-link :to="`/features/sound-store/${samplePack.display_name}`">{{ samplePack.display_name }}</router-link>
      <br><span>Samples:</span> {{ samplePack.samples.length }}
    </v-card-subtitle>
    <v-card-text>
      <v-row class="m-0">
        <div class="subtitle-1">
          <v-btn color="primary" v-if="itemAdded || alreadyInCart" text>${{ samplePack.amount }}<br />Added To Cart</v-btn>
          <v-btn color="primary" outlined @click="addToCart(samplePack)" v-else>${{ samplePack.amount }}</v-btn>
        </div>
      </v-row>
      <v-chip-group column class="soundstore-samplecard-genres">
        <v-chip class="mx-1">{{ samplePack.genre }}</v-chip>
        <v-chip class="mx-1">{{ samplePack.sub_genre }}</v-chip>
      </v-chip-group>
      <div v-if="showMore">
        <h2 class="soundstore-samplecard-heading" v-if="samplePack && samplePack.mood_types.length !== 0">Mood</h2>
        <v-chip-group class="soundstore-samplecard-chipgroup" column>
          <v-chip
            v-for="tag in samplePack.mood_types"
            :key="tag.id"
            color="purple darken-2"
            dark
          >
            {{ tag.name }}
          </v-chip>
        </v-chip-group>
        <h2 class="soundstore-samplecard-heading" v-if="samplePack && samplePack.hashtags.length !== 0">Keywords</h2>
        <v-chip-group class="soundstore-samplecard-chipgroup" active-class="primary--text" column>
          <v-chip v-for="hashtag in samplePack.hashtags" v-bind:key="hashtag.id">#{{ hashtag.hashtag }}</v-chip>
        </v-chip-group>
      </div>
    </v-card-text>
    <v-spacer />
    <v-card-actions justify="center">
      <v-btn
        color="primary"
        small
        :to="`/features/sound-store/sample-pack/${samplePack.uuid}`"
      >
        View Pack
      </v-btn>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" icon @click="showDetails" v-bind="attrs" v-on="on">
            <v-icon size="40">{{ detailsIcon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ detailsIconText }}</span>
      </v-tooltip>
    </v-card-actions>
    <ShowCheckoutModal ref="checkoutModal" />
  </v-card>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import ShowCheckoutModal from '@/components/SoundStore/ShowCheckoutModal'
import Vue from 'vue'

export default {
  props: {
    samplePack: Object
  },
  components: {
    ShowCheckoutModal
  },
  data: function () {
    return {
      alreadyInCart: 0,
      itemAdded: false,
      uuid: this.samplePack.uuid,
      showMore: false
    }
  },
  methods: {
    ...mapMutations({
      addSamplePackToCart: 'SSCart/ADD_SAMPLE_PACK_TO_CART'
    }),
    ...mapActions({
      updateCartRecord: 'SSCart/updateCartRecord'
    }),
    addToCart (item) {
      this.itemAdded = true
      this.addSamplePackToCart(item)
      this.$refs.checkoutModal.openModal()
      this.updateCartRecord()
    },
    showDetails () {
      this.showMore = !this.showMore
    },
    download: async function () {
      try {
        let { data: { data } } = await Vue.$http.get(`v1/sound-store/beat/free-download/${this.beat.uuid}`)
        var file_path = data.url
        var a = document.createElement('a')
        a.href = file_path
        a.download = file_path.substr(file_path.lastIndexOf('/') + 1)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } catch (err) {
        this.throwError(err)
      }
    }
  },
  computed: {
    ...mapGetters({
      cart: 'SSCart/getCart'
    }),
    detailsIcon () {
      return this.showMore ? 'mdi-chevron-up' : 'mdi-chevron-down'
    },
    detailsIconText () {
      return this.showMore ? 'Show Less' : 'Show More'
    }
  },
  mounted () {
    this.itemAdded = false
    let item = this.cart.samplePacks.filter(v => v.uuid === this.samplePack.uuid)
    this.alreadyInCart = item.length
  }
}
</script>

<style lang="scss" scoped>
.img-wrap {
  position: relative;
}

.soundstore-samplecard-genres {
  display: flex;
  align-items: flex-end;
  margin: 0 0 10px;
}

.soundstore-samplecard-heading,
.soundstore-samplecard-text {
  font-size: 0.875rem;
  margin: 0;
}

.soundstore-samplecard-text {
  font-family: "Roboto", sans-serif;
  font-size: 1.25rem;
  text-transform: uppercase;
  font-weight: bold;
  color: #32325d;
}

.soundstore-samplecard-text:nth-child(2) {
  margin: 0 0 10px;
}

.soundstore-samplecard-chipgroup {
  margin: 0 0 10px;
}

@media screen and (min-width: 576px) {
  .soundstore-samplecard-genres {
    min-height: 88px;
  }
}
</style>
