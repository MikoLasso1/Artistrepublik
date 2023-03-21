<template>
  <v-dialog v-model="dialog" max-width="600">
    <loading-overlay :loading="loading" />
    <v-card>
      <v-card-title class="headline">Become an Artist Republik Audio Engineer!</v-card-title>
      <v-col cols="12" class="pb-4">
        <engineer-terms v-if="step === 1" @updated-terms="setTerms" @proceed="proceed" />
        <engineer-details v-else-if="step === 2" @updated-details="setDetails" :engineer="audio_engineer" @proceed="proceed" @prevent="prevent" />
        <engineer-services v-else-if="step === 3" @updated-services="setServices" :engineer="audio_engineer" @proceed="proceed" @prevent="prevent" />
      </v-col>
      <v-card-actions class="btn-row">
        <v-btn v-show="step === 1" class="cancel-btn" @click="close">Cancel</v-btn>
        <v-btn v-show="step > 1" class="back-btn" @click="back">Back</v-btn>
        <v-btn v-show="step !== 3" :disabled="!canGoForward" class="normal-btn" @click="next">Next</v-btn>
        <v-btn v-show="step === 3" :disabled="!canGoForward" class="normal-btn" @click="finish">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import {
  mapGetters
} from 'vuex'
import Vue from 'vue'
import {
  serialize
} from 'object-to-formdata'
import EngineerTerms from '@/components/AudioEngineering/BecomeEngineerModal/EngineerTerms'
import EngineerDetails from '@/components/AudioEngineering/BecomeEngineerModal/EngineerDetails'
import EngineerServices from '@/components/AudioEngineering/BecomeEngineerModal/EngineerServices'
import LoadingOverlay from '@/components/LoadingOverlay'

const dataDefault = {
  loading: false,
  dialog: false,
  agreed: false,
  canGoForward: false,
  step: 1,
  audio_engineer_id: null,
  engineer: {
    id: null,
    agreed: false,
    description: null,
    genre_id: null,
    catalog: {
      id: null,
      name: null,
      description: null,
      img_url: null,
      services: {}
    },
    suspended: null
  }
}

export default {
  components: {
    EngineerTerms,
    EngineerDetails,
    EngineerServices,
    LoadingOverlay
  },
  mounted: function () {
    if (this.audio_engineer.is_audio_engineer && !this.audio_engineer.is_banned) {
      this.audio_engineer_id = this.audio_engineer.id
      this.step = 2
    }
  },
  data: function () {
    return {
      loading: false,
      dialog: false,
      agreed: false,
      canGoForward: false,
      step: 1,
      audio_engineer_id: null,
      engineer: {
        id: null,
        agreed: false,
        description: null,
        genre_id: null,
        catalog: {
          name: null,
          description: null,
          img_url: null,
          services: {}
        },
        suspended: null
      }
    }
  },
  computed: {
    ...mapGetters({
      audio_engineer: 'getAudioEngineer'
    }),
    saveURL: function () {
      return this.audio_engineer && this.audio_engineer.id ? 'v1/audio-engineering/account/' + this.audio_engineer.id : `v1/audio-engineering/account`
    }
  },
  methods: {
    next: function () {
      this.canGoForward = false
      this.step++
    },
    back: function () {
      this.canGoForward = false
      this.step--
    },
    cancel: function () {
      this.step = 0
      this.$emit('close')
    },
    proceed: function () {
      this.canGoForward = true
    },
    prevent: function () {
      this.canGoForward = false
    },
    open: function () {
      this.dialog = true
    },
    finish: async function () {
      await this.save()
    },

    save: async function () {
      this.loading = true
      const formData = serialize({
        ...this.engineer,
        ...{
          _method: 'PUT'
        }
      })
      try {
        await Vue.$http({
          method: 'POST',
          url: this.saveURL,
          data: formData,
          headers: {
            'content-type': 'multipart/form-data'
          }
        })
        this.$emit('success')
        this.reset()
        this.close()
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    },
    reset () {
      Object.keys(dataDefault).forEach(k => {
        if (Object.prototype.hasOwnProperty.call(this.$data, k)) {
          this.$data[k] = dataDefault[k]
        }
      })
    },
    close: function () {
      this.step = 1
      this.dialog = false
      this.$emit('close')
      this.$store.dispatch('fetchSettings')
    },
    setTerms: function () {
      this.engineer.agreed = true
    },
    setDetails: function (details) {
      this.engineer.catalog.img_url = details.img_url
      this.engineer.catalog.name = details.name
      this.engineer.catalog.id = details.id
      this.engineer.genre_id = details.genre
      this.engineer.description = details.description
      this.engineer.catalog.description = details.catalog_description
    },
    setServices: function (services) {
      let index = 0
      this.engineer.catalog.services = {}
      for (const service of services) {
        this.engineer.catalog.services[++index] = {
          id: service.id,
          subtask_id: service.subtask,
          title: service.name,
          description: service.description,
          price: service.price * 100,
          estimated_turnaround: service.turnaround
        }
      }
    }
  }
}
</script>

<style>
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

.back-btn {
  color: #fff !important;
  background-color: #172b4d !important;
  border-color: #172b4d !important;
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
