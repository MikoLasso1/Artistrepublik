<template>
  <v-card flat class="text-center w-100" :uploading="uploading">
    <v-alert v-if="error" dark color="red">{{ error }}</v-alert>
    <h2>
      Details
    </h2>
    <v-form class="mt-4" v-model="valid" ref="form">
      <v-row>
        <v-col cols="12" md="6">
          <v-row no-gutters align="center">
            <v-col cols="12">
              <div class="text-center">
                <v-file-input
                  v-model="details.file"
                  @change="() => $emit('upload', details.file)"
                  hint="The file you want the engineer to master (zip .wav)"
                  color="deep-purple accent-4"
                  accept="audio/wav,application/zip"
                  counter
                  placeholder="Select your file"
                  prepend-icon="mdi-paperclip"
                  outlined
                  :show-size="1000"
                />
              </div>
            </v-col>
          </v-row>
          <v-row no-gutters align="center">
            <v-col cols="12">
              <v-dialog ref="lengthMenu" v-model="lengthMenu" return-value.sync="details.estimated_length" persistent transition="scale-transition" width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="details.estimated_length" label="Length of track" prepend-icon="mdi-clock-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-time-picker v-if="lengthMenu" v-model="details.estimated_length" class="mt-4" format="24hr" scrollable use-seconds @click:second="$refs.lengthMenu.save(details.estimated_length)">
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="lengthMenu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.lengthMenu.save(details.estimated_length)">OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>
          </v-row>
          <v-row no-gutters align="center">
            <v-col cols="12">
              <v-dialog ref="finalLengthMenu" v-model="finalLengthMenu" return-value.sync="details.estimated_final_length" persistent transition="scale-transition" width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="details.estimated_final_length" label="Length of final product" prepend-icon="mdi-clock-outline" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-time-picker
                  v-if="finalLengthMenu"
                  v-model="details.estimated_final_length"
                  class="mt-4"
                  format="24hr"
                  scrollable
                  use-seconds
                  @click:second="$refs.finalLengthMenu.save(details.estimated_final_length)"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="finalLengthMenu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.finalLengthMenu.save(details.estimated_final_length)">OK</v-btn>
                </v-time-picker>
              </v-dialog>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6">
          <v-row no-gutters align="center">
            <v-col cols="12">
              <v-textarea v-model="details.requests" placeholder="Request" auto-grow outlined rows="6" row-height="15" hint="Describe anything particulars about your current request"></v-textarea>
            </v-col>
          </v-row>
          <v-row no-gutters align="center">
            <v-col cols="12">
              <v-textarea v-model="details.notes" placeholder="Notes" auto-grow outlined rows="6" row-height="15" hint="Add any additional notes that may be useful"></v-textarea>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
export default {
  data: function () {
    return {
      loading: false,
      uploading: false,
      error: null,
      valid: false,
      lengthMenu: false,
      finalLengthMenu: false,
      details: {
        file: null,
        estimated_length: null,
        estimated_final_length: null,
        requests: null,
        notes: null
      },
      rules: {
        file: [
          v => !!v || 'A file is required'
        ],
        estimated_length: [
          v => !!v || 'estimated length is required'
        ],
        estimated_final_length: [
          v => !!v || 'estimated final length is required'
        ]
      }
    }
  },
  methods: {
    isUploading: function () {
      this.uploading = true
    },
    isDoneUploading: function () {
      this.uploading = false
    }
  },
  watch: {
    details: {
      handler (details) {
        const isDone = details.file && details.estimated_length && details.estimated_final_length
        if (isDone) {
          this.error = null
          this.$emit('updated-details', details)
          this.$emit('proceed')
        } else {
          this.$emit('prevent')
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
