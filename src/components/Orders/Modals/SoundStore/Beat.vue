<template>
  <div>
    <v-row>
      <v-col md="8">
        <h2>
          {{ beat.name }} <span class="text-capitalize">({{ type }})</span>
        </h2>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="text-right" v-if="contractButton">
        <order-contract :uuid="soundOrderUuid" />
      </v-col>
    </v-row>

    <v-row>
      <v-col md="4">
        <span>By: {{ beat.display_name }}</span>
        <br />
        <span>BPM: {{ beat.bpm }}</span>
        <br />
        <span>Plays: {{ beat.plays }}</span>
        <br />
        <span>Download Times: {{ downloadTimes }}</span>
      </v-col>
      <v-col md="5">
        <span>Sub genre: {{ beat.sub_genre }}</span>
        <br />
        <span>Genre: {{ beat.genre }}</span>
        <br />
        <span class="text-capitalize">Track type: {{ beat.track_type }}</span>

      </v-col>
      <v-col md="3" class="text-center">
        <ul class="download-files">
          <li class="text-left mb-1" v-for="(format, index) in beat.available_sound_formats" :key="index">
            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="primary--text mr-1"
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click="download(format)"
                  :disabled="processingDownload"
                  :loading="processingDownload"
                >
                  <v-icon size="40">mdi-download-circle</v-icon>
                </v-btn>
                <span>Download {{ format }}</span>
              </template>
              <span>Download {{ format }}</span>
            </v-tooltip>
          </li>
        </ul>

      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue'
import OrderContract from '@/components/Orders/Modals/SoundStore/OrderContract'

export default {
  components: {
    OrderContract
  },
  props: {
    order: {
      type: Object,
      default: null
    },
    contractButton: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      processingDownload: false,
      loading: false,
      contracturl: null
    }
  },
  methods: {
    download: async function (type) {
      this.processingDownload = true
      try {
        let {
          data: { data }
        } = await Vue.$http.get(
          `v1/sound-store/beat/paid-download/${this.beat.uuid}/${this.soundOrderUuid}`, {
            params: {
              file_type: type
            }
          }
        )
        var file_path = data.url
        var a = document.createElement('a')
        a.href = file_path
        a.target = '_blank'
        a.download = file_path.substr(file_path.lastIndexOf('/') + 1)
        // a.setAttribute('download', 'file.pdf');
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      } catch (err) {
        this.throwError(err)
      }
      this.processingDownload = false
    }
  },
  computed: {
    beat () {
      return this.order.order.beat
    },
    downloadTimes () {
      return this.order.download_times
    },
    type () {
      return this.order.type
    },
    soundOrderUuid () {
      return this.order.uuid
    }
  }
}
</script>

<style lang="scss" scoped>
hr {
  margin: 0.5rem 0;
}

.primary--text {
  color: #ee44aa !important;
  caret-color: #ee44aa !important;
}

ul.download-files {
  list-style: none;
}
</style>
