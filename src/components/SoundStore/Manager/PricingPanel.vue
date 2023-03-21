<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <v-row no-gutters class="align-center">
        <v-col cols="4">
          {{ form.name }}
        </v-col>
        <v-col cols="4" class="text-center">
          <v-btn color="red" dark @click.stop="deletePrice">Delete</v-btn>
        </v-col>
        <v-col cols="4" class="text-right">
          ${{ form.amount }}
        </v-col>
      </v-row>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-overlay absolute :value="overlay">
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
      <v-alert
        type="warning"
        v-if="unsavedChanges"
        outlined
      >You have unsaved changes. Hit save.
      </v-alert>
      <v-form v-model="valid" ref="form" @submit.prevent="onSubmit">
        <v-row>
          <v-col sm="6" cols="12">
            <v-text-field
              v-model="form.name"
              label="Price Name"
              :rules="rules.name"
            ></v-text-field>
          </v-col>
          <v-col sm="6" cols="12">
            <v-text-field
              v-model="form.amount"
              label="Price"
              :rules="rules.amount"
              type="number"
              prepend-icon="mdi-currency-usd"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="3" cols="12">
            <v-text-field
              v-model="form.distribute_amount"
              label="Distribute Amount"
              :rules="rules.distribute_amount"
              type="number"
              hint="Leave blank for unlimited distributions"
            ></v-text-field>
          </v-col>
          <v-col sm="3" cols="12">
            <v-text-field
              v-model="form.online_streams"
              label="Online Streams"
              type="number"
              hint="Leave blank for unlimited online streams"
            ></v-text-field>
          </v-col>
          <v-col sm="3" cols="12">
            <v-text-field
              v-model="form.music_videos"
              label="Music Videos"
              type="number"
              hint="Leave blank for unlimited music videos"
            ></v-text-field>
            <v-text-field
              v-model="form.radio_station_amount"
              label="Radio Station Amount"
              type="number"
              hint="Leave blank for unlimited radio stations"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-checkbox
          v-model="form.music_recording"
          label="Can be used for music recording"
        ></v-checkbox>
        <v-checkbox
          v-model="form.for_profit_performances"
          label="Can be used for profit live performances"
        ></v-checkbox>
        <v-checkbox
          v-model="form.radio_rights"
          label="Radio broadcasting rights"
        ></v-checkbox>
        <v-checkbox
          v-model="form.exclusive"
          label="Exclusive rights"
        ></v-checkbox>
        <h3 class="h3">Available File Types</h3>
        <v-row>
          <v-col cols="4">
            <v-checkbox
              v-model="form.download_types"
              label=".wav"
              value="WAV"
            ></v-checkbox>
          </v-col>
          <v-col cols="4">
            <v-checkbox
              v-model="form.download_types"
              label=".mp3"
              value="MP3"
            ></v-checkbox>
          </v-col>
          <v-col cols="4">
            <v-checkbox
              v-model="form.download_types"
              label="Stems"
              value="Track Stems"
            ></v-checkbox>
          </v-col>
        </v-row>
        <h3 class="h3">Discounts</h3>
        <v-alert
          type="info"
          outlined
        >Hit + icon after entering attribute.
        </v-alert>
        <beat-sales v-model="form.sales" />
        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-btn color="primary" type="submit">Save</v-btn>
        </div>
      </v-form>
      <v-alert
        type="warning"
        v-if="unsavedChanges"
        class="mt-2"
        outlined
      >You have unsaved changes. Hit save.
      </v-alert>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import Vue from 'vue'
import BeatSales from '@/components/SoundStore/Manager/BeatSales'

export default {
  components: {
    BeatSales
  },
  props: {
    price: Object,
    index: Number,
    id: Number
  },
  data: function () {
    return {
      overlay: false,
      valid: true,
      form: {
        name: this.price ? this.price.name : null,
        amount: this.price ? this.price.amount : null,
        music_recording: this.price ? this.price.music_recording : 0,
        for_profit_performances: this.price ? this.price.for_profit_performances : 0,
        radio_rights: this.price ? this.price.radio_rights : 0,
        exclusive: this.price ? this.price.exclusive : 0,
        distribute_amount: this.price ? this.price.distribute_amount : 0,
        online_streams: this.price ? this.price.online_streams : 0,
        music_videos: this.price ? this.price.music_videos : 0,
        radio_station_amount: this.price ? this.price.radio_station_amount : 0,
        download_types: this.price ? this.price.download_types : [],
        sales: this.price ? this.price.sales : []
      },
      rules: {
        name: [
          v => !!v || 'A price name is required',
          v => !(v && v.length < 5) || 'Price name must be at least 5 characters'
        ],
        amount: [
          v => !!v || 'Price is required'
        ]
      },
      unsavedChanges: false
    }
  },
  methods: {
    onSubmit: async function () {
      this.unsavedChanges = false
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      if (this.id) {
        this.overlay = true
        try {
          let { data: { data } } = await Vue.$http.put(`v1/sound-store/beat/pricing/${this.id}`, this.form)
          this.form = data
        } catch (err) {
          this.throwError(err)
        }
        this.overlay = false
        this.unsavedChanges = false
      }
      this.$emit('saved', this.index, this.form)
    },
    deletePrice: async function () {
      if (this.id) {
        try {
          await Vue.$http.delete(`v1/sound-store/beat/pricing/${this.id}`)
        } catch (err) {
          this.throwError(err)
        }
      }
      this.$emit('delete', this.index)
    }
  },
  watch: {
    form: {
      handler: function () {
        this.unsavedChanges = true
      },
      deep: true
    }
  }
}
</script>

<style>
label {
  margin-bottom: 0;
}
</style>
