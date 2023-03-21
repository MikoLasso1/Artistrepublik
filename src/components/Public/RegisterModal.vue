<template>
  <div>
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">Register</v-card-title>
        <v-card-text>
          <register-modal-view @next-step="dialog = false" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import RegisterModalView from '@/components/Public/RegisterModalView'

export default {
  components: {
    RegisterModalView
  },
  data: function () {
    return {
      dialog: false
    }
  },
  methods: {
    openModal: function () {
      this.dialog = true
    }
  }
}
</script>

<style>

</style>
