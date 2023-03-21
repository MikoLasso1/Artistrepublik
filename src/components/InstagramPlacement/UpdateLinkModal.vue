<template>
  <v-dialog v-model="dialog" max-width="400">
    <v-card :loading="loading">
      <v-card-title class="headline">
        Update Link
        <v-spacer></v-spacer>
        <v-icon @click="dialog = false">mdi-close</v-icon>
      </v-card-title>
      <v-card-text>
        <p class="body-1">Paste the Instagram link (You can do this later)</p>
        <v-form v-model="valid" ref="form">
          <v-text-field
            v-model="link"
            :rules="linkRules"
            label="Link URL"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="doUpdateLink">Update Link</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    order: Object
  },
  data: function () {
    return {
      loading: false,
      dialog: false,
      valid: true,
      link: this.order ? this.order.link : null,
      linkRules: [
        v => !!v || 'You must enter a link'
      ]
    }
  },
  methods: {
    openModal: function () {
      this.dialog = true
    },
    doUpdateLink: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.loading = true
      let data = { link: this.link }
      try {
        await Vue.$http.put(`v1/instagram-placement/order/${this.order.id}`, data)
        this.$noty.success('Link updated successfully')
        this.dialog = false
      } catch (err) {
        this.throwError(err)
      }
      this.loading = false
    }
  }
}
</script>

<style>

</style>
