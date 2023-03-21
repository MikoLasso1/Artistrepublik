<template>
  <v-row class="justify-center">
    <v-col md="12" class="text-center">
      <div style="border: 1px dashed gray; padding: 10px;" class="mt-3">
        <h3 class="mb-0">
          You are making changes for Layout :
          <span class="green--text">{{ layoutId }}</span>
        </h3>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      layoutId: 'MiniProfile/getSelectedLayout'
    })
  }
}
</script>
