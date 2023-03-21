<template>
  <v-dialog
    id="pr-order-link-modal"
    class="curator-table-modal"
    v-model="show"
    max-width="850"
  >
    <v-card>
      <v-card-title>
        <h2 class="m-0">Add Order Link</h2>
        <v-spacer />
        <v-btn text @click="closeModal">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-subtitle>
        Order Link
      </v-card-subtitle>
      <v-card-text>
        <v-form ref="form" @submit.prevent v-model="valid">
          <v-text-field
            v-model="publication_link"
            :rules="pubLinkRules"
            label="Publication Link"
            class="required"
          ></v-text-field>
          <v-btn
            type="submit"
            color="primary"
            :disabled="processing"
            @click="updatePublicationLink"
          >
            <span v-if="!processing">Submit</span>
            <span v-if="processing">
                <v-progress-circular
                  indeterminate
                  color="primary"
                ></v-progress-circular> Processing...
            </span>
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    orderId: [String, Number],
    publicationLink: [String]
  },
  data: function () {
    return {
      show: false,
      valid: true,
      order: null,
      processing: false,
      publication_link: this.publicationLink,
      pubLinkRules: [
        v => !!v || 'You must provide a link.',
        v => /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(v) || 'Please provide a valid link.'
      ]
    }
  },
  methods: {
    openModal () {
      this.show = true
    },
    closeModal () {
      this.show = false
    },
    updatePublicationLink () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      this.processing = true
      this.$noty.info('Processing Request...')
      Vue.$http.patch(`v1/press-release/order/${this.orderId}`, {
        link: this.publication_link,
        status: 'published'
      })
        .then(() => {
          this.$noty.success('Link added successfully.')
        })
        .catch(() => {
          this.$noty.warning('Error Occurred while processing request.')
        })
        .then(() => this.processing = false)
    }
  },
  watch: {
    publicationLink: function (newVal) {
      this.publication_link = newVal
    }
  }
}
</script>
