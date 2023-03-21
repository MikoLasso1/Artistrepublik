<template>
  <v-dialog v-model="dialog" max-width="600" v-if="order">
    <loading-overlay :loading="loading" />
    <v-card>
      <v-card-title class="px-6 py-3">
        <h2> {{ order.genre.name }} {{ order.type.name }} Review</h2>
      </v-card-title>
      <v-card-subtitle class="px-6">
        By: {{ order.reviewer.brand }}
      </v-card-subtitle>
      <v-card-text>
        <p class="body-1">Review:</p>
        <v-row no-gutters align="center" justify="center" class="px-6 pb-8 col-12 mx-0">
          <vue-plyr ref="plyr" :options="options" v-if="order.web_video.uploaded || order.video.uploaded">
            <video controls playsinline size="720" data-poster="/img/brand/logo.png">
              <source size="720" :src="videoSrc" :type="videoType" />
            </video>
          </vue-plyr>
          <vue-plyr ref="plyr" :options="options" v-else>
            <video controls playsinline data-poster="/img/brand/logo.png">
              <source size="720" src="#" type="video/mp4" />
            </video>
          </vue-plyr>
        </v-row>
        <p class="body-1">Ratings:</p>
        <v-card-text>
          <v-row no-gutters align="center">
            <v-list two-line style="width: 100%">
              <v-list-item-group active-class="pink--text" multiple>
                <template v-for="(response, index) in order.responses">
                  <v-list-item :key="response.priority">
                    <template v-if="$vuetify.breakpoint.mdAndDown">
                      <v-list-item-content>
                        <v-list-item-subtitle class="text--primary" style="white-space: break-spaces;line-height: 1.5;" v-text="response.question"></v-list-item-subtitle>
                        <v-rating
                          readonly :value="response.rating" color="yellow accent-4" dense hover length="10" size="10" empty-icon="$ratingEmpty" full-icon="$ratingFull"
                          half-icon="$ratingHalf"
                        ></v-rating>
                      </v-list-item-content>
                    </template>
                    <template v-else>
                      <v-list-item-content>
                        <v-list-item-subtitle class="text--primary" style="white-space: pre-wrap;line-height: 1.5;" v-text="response.question"></v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-rating
                          readonly :value="response.rating" color="yellow accent-4" dense hover length="10" size="10" empty-icon="$ratingEmpty" full-icon="$ratingFull"
                          half-icon="$ratingHalf"
                        ></v-rating>
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                  <v-divider style="margin: 10px;" v-if="index < order.responses.length - 1" :key="index"></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
          </v-row>

          <p class="body-1">Written responses:</p>
          <v-row no-gutters align="center">
            <v-card-text>
              <div>Highlight at least 3 things that you liked about the song<sup style="color:red;">*</sup>:</div>
              <div class="text--primary required">
                {{ order.liked_highlights }}
              </div>
            </v-card-text>
            <v-card-text>
              <div>Highlight at least 3 things that the song could improve on<sup style="color:red;">*</sup>:</div>
              <div class="text--primary required">
                {{ order.improved_highlights }}
              </div>
            </v-card-text>
            <v-card-text>
              <div>Additional Comments</div>
              <div class="text--primary">
                {{ order.additional_comments }}
              </div>
            </v-card-text>
          </v-row>
        </v-card-text>
      </v-card-text>
      <v-card-actions class="btn-row px-5 py-3">
        <v-btn class="cancel-btn" @click="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import LoadingOverlay from '@/components/LoadingOverlay'

export default {
  components: {
    LoadingOverlay
  },
  props: {
    order: Object
  },
  data: function () {
    return {
      options: {},
      uuid: null,
      loading: false,
      dialog: false,
      agreed: false
    }
  },
  mounted () {
    this.uuid = this.generateUUID()
  },
  computed: {
    videoType: function () {
      return this.order.web_video ? 'video/' + this.order.web_video.extension : 'video/' + this.order.video.extension
    },
    videoSrc: function () {
      if (!this.order) {
        return null
      }
      return this.order.web_video_url ? this.order.web_video_url : this.order.video_url
    }
  },
  methods: {
    generateUUID: function () {
      let d = new Date().getTime() // Timestamp
      let d2 = (performance && performance.now && (performance.now() * 1000)) || 0 // Time in microseconds since page-load or 0 if unsupported
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 //random number between 0 and 16
        if (d > 0) {
          // Use timestamp until depleted
          r = (d + r) % 16 | 0
          d = Math.floor(d / 16)
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0
          d2 = Math.floor(d2 / 16)
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
      })
    },
    cancel: function () {
      this.$emit('close')
    },
    open: function () {
      this.dialog = true
    },
    finish: async function () {
      this.$noty.success('Order Successful')
      this.uuid = this.generateUUID()
      this.$emit('success')
      this.close()
    },
    close: function () {
      this.dialog = false
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.headline {
  justify-content: center;
}

.btn-row {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.normal-btn {
  color: white !important;
  background-color: #5e72e4 !important;
  font-family: 'Open Sans';
  text-transform: none;
  letter-spacing: normal;
  font-weight: 600;
}

.cancel-btn {
  color: #fff !important;
  background-color: #172b4d !important;
  border-color: #172b4d !important;
  font-family: 'Open Sans';
  text-transform: none;
  letter-spacing: normal;
  font-weight: 600;
}
</style>
