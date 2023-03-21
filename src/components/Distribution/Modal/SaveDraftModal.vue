<template>
  <v-dialog v-model="dialog" max-width="350">
    <v-card :loading="loading">
      <v-card-title class="headline">Save Draft</v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
            v-model="draft_name"
            :rules="draft_name_rules"
            label="Draft Name"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="doSaveDraft">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    release: Object
  },
  data: function () {
    return {
      dialog: false,
      loading: false,
      valid: true,
      draft_name: (this.release && this.release.draft) ? this.release.draft : '',
      draft_name_rules: [
        v => !!v || 'Draft name is required'
      ]
    }
  },
  methods: {
    openModal: function () {
      this.dialog = true
    },
    doSaveDraft: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      try {
        await Vue.$http.post(`v1/distribution/release/${this.release.id}/save-draft`, { draft_name: this.draft_name })
        this.$noty.success('Draft saved successfully')
        this.dialog = false
      } catch (err) {
        this.throwError(err)
        this.$noty.warning('Error Occurred while processing request.')
      }
      this.loading = false
    }
  }
}
</script>

<style>

</style>
