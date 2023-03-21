<template>
  <v-dialog v-model="dialog" max-width="450">
    <v-card>
      <v-card-title style="word-break: break-word;">
        Are you sure you want to delete &nbsp;<span class="green--text">{{
          name
        }}</span
      >&nbsp; ?
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="error" @click="deleteLayout" :loading="processing">
          Delete
        </v-btn>

        <v-btn color="primary" @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      dialog: false,
      name: null,
      id: null,
      processing: false
    }
  },
  methods: {
    ...mapActions({
      deleteLayoutAction: 'MiniProfile/deleteLayout',
      getUserLayouts: 'MiniProfile/getUserLayouts'
    }),
    deleteLayout () {
      if (this.id) {
        this.processing = true
        this.deleteLayoutAction(this.id)
          .then(() => {
            this.$noty.success('Layout deleted successfully')
            this.getUserLayouts()
            this.dialog = false
          })
          .catch(err => {
            this.processing = false
            this.$noty.warning('Error Occurred while processing request.')
            this.throwError(err)
          })
          .finally(() => this.processing = false)

      }
    },
    openDialog (data) {
      this.dialog = true
      this.name = data.name
      this.id = data.id
    }
  }

}
</script>
