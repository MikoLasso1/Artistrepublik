<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card>
      <v-card-title class="headline">
        Upload File
        <v-spacer></v-spacer>
        <v-icon @click="dialog = false">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <p class="body-1">Add the mastered track in zip or wav</p>
        <v-form v-model="valid" ref="form">
          <v-row no-gutters align="center">
            <v-col cols="12">
              <div class="text-center">
                <v-file-input
                  v-model="file" :rules="fileRules" hint="The mastered file you want to send (zip .wav)" color="deep-purple accent-4" accept=".zip,.wav" counter label="File input"
                  placeholder="Select your file" prepend-icon="mdi-paperclip" outlined :show-size="1000"
                />
              </div>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="doUploadFile">Upload File</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    order: Object
  },
  data: function () {
    return {
      loading: false,
      dialog: false,
      valid: true,
      file: this.order ? this.order.file : null,
      fileRules: [
        v => !!v || 'You must upload a file'
      ]
    }
  },
  methods: {
    openModal: function () {
      this.dialog = true
    },
    doUploadFile: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      let data = {
        file: this.file
      }
      try {
        this.$emit('status-changed', 'completed', data)
        this.dialog = false
      } catch (err) {
        this.throwError(err)
      }
    }
  }
}
</script>

<style>

</style>
