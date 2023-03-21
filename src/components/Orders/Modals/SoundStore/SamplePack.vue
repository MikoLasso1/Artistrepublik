<template>
  <div>
    <v-row>
      <v-col md="8">
        <h2>
          {{ samplePack.name }} <span class="text-capitalize">(Sample Pack)</span>
        </h2>
      </v-col>
      <v-spacer></v-spacer>
      <v-col class="text-right" v-if="contractButton">
        <order-contract :uuid="soundOrderUuid" />
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4">
        <span>By: {{ samplePack.display_name }}</span>
        <br />
        <span>Download Times: {{ downloadTimes }}</span>
      </v-col>
      <v-col md="5">
        <span>Sub genre: {{ samplePack.sub_genre }}</span>
        <br />
        <span>Genre: {{ samplePack.genre }}</span>
        <br />
      </v-col>
      <v-col md="3" class="text-center" v-if="this.samplePack.zip_file_location">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="primary--text"
              icon
              v-bind="attrs"
              v-on="on"
              @click="downloadZip"
              :disabled="downloadZipProcessing"
              :loading="downloadZipProcessing"
            >
              <v-icon size="40">mdi-download-circle</v-icon>
            </v-btn>
          </template>
          <span>Download Zip</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-divider class="mt-2"></v-divider>
    <v-row>
      <v-col>
        <h2>Samples</h2>
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th scope="col" class="text-left">
                Name
              </th>
              <th scope="col" class="text-left">
                BPM
              </th>
              <th scope="col" class="text-left">
                Price
              </th>
              <th scope="col" class="text-center">
                Download
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="item in samples"
              :key="item.uuid"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.bpm }}</td>
              <td>${{ item.amount }}</td>
              <td class="text-center">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="primary--text"
                      icon
                      v-bind="attrs"
                      v-on="on"
                      @click="download(item.uuid)"
                    >
                      <v-icon size="40">mdi-download-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Download</span>
                </v-tooltip>
              </td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
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
    order: Object,
    contractButton: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      downloadZipProcessing: false
    }
  },
  methods: {
    download: async function (uuid) {
      try {
        let {
          data: { data }
        } = await Vue.$http.get(
          `v1/sound-store/sample-pack/sample/paid-download/${uuid}/${this.soundOrderUuid}`
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
    },
    downloadZip: async function () {
      this.downloadZipProcessing = true

      try {
        let {
          data: { data }
        } = await Vue.$http.get(
          `v1/sound-store/sample-pack/zip-download/${this.samplePack.uuid}`
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
      this.downloadZipProcessing = false
    }
  },
  computed: {
    samplePack () {
      return this.order.order.sample_pack
    },
    samples () {
      return this.order.order.samples
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
</style>
