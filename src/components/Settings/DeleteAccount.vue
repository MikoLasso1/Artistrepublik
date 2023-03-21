<template>
  <v-card>
    <v-card-text class="delete-container">
      <v-dialog v-model="deleteModal" max-width="500">
        <template v-slot:activator="{ on, attrs }">
          <span class="delete-text" v-bind="attrs" v-on="on">Delete Account</span>
        </template>
        <v-card>
          <v-card-title>Are you sure you want to delete your account?</v-card-title>
          <v-card-text>
            <div class="text-center" v-if="loading">
              <v-progress-circular indeterminate size="64" color="purple"></v-progress-circular>
            </div>
            <div v-else-if="!canDelete">
              You have open orders or distribution releases.
              <br />Contact
              <a
                href="mailto:support@artistrepublik.com"
                target="_blank"
                rel="noopener"
              >support</a> for help.
            </div>
            <div v-if="canDelete">
              <v-form v-model="valid" ref="form">
                <v-textarea
                  v-model="deleteReason"
                  label="Delete Reason"
                  :rules="deleteReasonRule"
                  required
                ></v-textarea>
              </v-form>
              Once you delete your account, all your information will be deleted.
            </div>
          </v-card-text>
          <v-card-actions v-if="canDelete">
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="deleteModal = false">Cancel</v-btn>
            <v-btn color="red darken-1" text @click="doDelete">Delete Account</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'

export default {
  data: function () {
    return {
      loading: false,
      canDelete: false,
      deleteModal: false,
      deleteReason: '',
      valid: true,
      deleteReasonRule: [v => !!v || 'Delete Reason is required']
    }
  },
  watch: {
    deleteModal: async function (v) {
      if (!v) {
        return
      }
      this.loading = true
      let {
        data: { data }
      } = await Vue.$http.get('v1/settings/can-delete-account')
      if (!data.can_delete) {
        this.canDelete = false
      } else {
        this.canDelete = true
      }
      this.loading = false
    }
  },
  methods: {
    doDelete: async function () {
      this.$refs.form.validate()
      if (!this.valid) {
        return
      }
      try {
        let {
          data: { data }
        } = await Vue.$http.delete('v1/settings/delete-account', {
          data: {
            delete_reason: this.deleteReason
          }
        })
        if (data.success) {
          setTimeout(() => {
            this.$router.push('/logout')
          }, 1500)
        } else {
          alert('Something went wrong. Please contact support.')
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>

<style>
.delete-container {
  text-align: center;
}

.delete-text {
  color: gray;
}
</style>
